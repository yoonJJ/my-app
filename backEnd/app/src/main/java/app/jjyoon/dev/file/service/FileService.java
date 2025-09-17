package app.jjyoon.dev.file.service;

import app.jjyoon.dev.file.dto.FileResponse;
import app.jjyoon.dev.file.entity.FileEntity;
import app.jjyoon.dev.file.repository.FileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileService {
    
    private final FileRepository fileRepository;
    
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;
    
    public FileResponse uploadFile(MultipartFile file) {
        try {
            // 파일명 검증
            String originalName = StringUtils.cleanPath(file.getOriginalFilename());
            if (originalName.contains("..")) {
                throw new RuntimeException("파일명에 부적절한 문자가 포함되어 있습니다");
            }
            
            // 파일 확장자 검증
            String contentType = file.getContentType();
            if (contentType == null || !isAllowedContentType(contentType)) {
                throw new RuntimeException("허용되지 않는 파일 형식입니다");
            }
            
            // 파일 크기 검증 (10MB 제한)
            if (file.getSize() > 10 * 1024 * 1024) {
                throw new RuntimeException("파일 크기는 10MB를 초과할 수 없습니다");
            }
            
            // 저장할 파일명 생성
            String storedName = UUID.randomUUID().toString() + "_" + originalName;
            
            // 업로드 디렉토리 생성
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // 파일 저장
            Path targetLocation = uploadPath.resolve(storedName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            // 데이터베이스에 파일 정보 저장
            FileEntity fileEntity = new FileEntity(
                    originalName,
                    storedName,
                    targetLocation.toString(),
                    file.getSize(),
                    contentType
            );
            
            FileEntity savedFile = fileRepository.save(fileEntity);
            
            return new FileResponse(
                    savedFile.getId(),
                    savedFile.getOriginalName(),
                    savedFile.getStoredName(),
                    savedFile.getFilePath(),
                    savedFile.getFileSize(),
                    savedFile.getContentType(),
                    savedFile.getCreatedAt(),
                    "/api/files/download/" + savedFile.getId()
            );
                    
        } catch (IOException ex) {
            throw new RuntimeException("파일 저장 중 오류가 발생했습니다", ex);
        }
    }
    
    public Resource downloadFile(Long fileId) {
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다"));
        
        try {
            Path filePath = Paths.get(fileEntity.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("파일을 읽을 수 없습니다");
            }
        } catch (Exception ex) {
            throw new RuntimeException("파일 다운로드 중 오류가 발생했습니다", ex);
        }
    }
    
    public void deleteFile(Long fileId) {
        FileEntity fileEntity = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다"));
        
        try {
            // 실제 파일 삭제
            Path filePath = Paths.get(fileEntity.getFilePath());
            Files.deleteIfExists(filePath);
            
            // 데이터베이스에서 삭제
            fileRepository.delete(fileEntity);
        } catch (IOException ex) {
            throw new RuntimeException("파일 삭제 중 오류가 발생했습니다", ex);
        }
    }
    
    private boolean isAllowedContentType(String contentType) {
        return contentType.startsWith("image/") || 
               contentType.startsWith("application/pdf") ||
               contentType.startsWith("text/") ||
               contentType.equals("application/zip");
    }
}
