package com.ecommerce.media.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URL;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.cloudfront.domain:}")
    private String cdnDomain;

    public String uploadFile(byte[] data, String originalFileName, String contentType) {
        String extension = "";
        if (StringUtils.hasText(originalFileName) && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String key = "uploads/" + UUID.randomUUID() + extension;

        PutObjectRequest putRequest = PutObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .contentType(contentType)
            .build();

        s3Client.putObject(putRequest, RequestBody.fromBytes(data));
        log.info("File uploaded to S3: bucket={}, key={}", bucket, key);

        return getFileUrl(key);
    }

    public void deleteFile(String key) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .build();

        s3Client.deleteObject(deleteRequest);
        log.info("File deleted from S3: bucket={}, key={}", bucket, key);
    }

    public String getFileUrl(String key) {
        if (StringUtils.hasText(cdnDomain)) {
            return "https://" + cdnDomain + "/" + key;
        }

        try {
            URL url = s3Client.utilities().getUrl(builder -> builder.bucket(bucket).key(key));
            return url.toString();
        } catch (Exception e) {
            log.warn("Could not generate S3 URL, falling back to simple path");
            return "https://" + bucket + ".s3.amazonaws.com/" + key;
        }
    }
}
