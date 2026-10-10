package com.landregistration.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.landregistration.backend.model.Application;
import com.landregistration.backend.repository.ApplicationRepository;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationRepository applicationRepository;

    private final Path uploadDirectory
            = Paths.get("uploads", "applications");

    public ApplicationController(
            ApplicationRepository applicationRepository) {

        this.applicationRepository
                = applicationRepository;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> submitApplication(
            @RequestPart("application") Application application,
            @RequestPart("saleDeed") MultipartFile saleDeed,
            @RequestPart("identityProof") MultipartFile identityProof,
            @RequestPart(
                    value = "additionalDocument",
                    required = false
            ) MultipartFile additionalDocument) {

        try {

            if (saleDeed == null
                    || saleDeed.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Sale deed / ownership document is required.");
            }

            if (identityProof == null
                    || identityProof.isEmpty()) {

                return ResponseEntity.badRequest()
                        .body("Identity proof is required.");
            }

            String applicationId
                    = "LR"
                    + LocalDateTime.now()
                            .format(
                                    DateTimeFormatter.ofPattern(
                                            "yyyyMMdd"
                                    )
                            )
                    + UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 6)
                            .toUpperCase();

            application.setApplicationId(
                    applicationId
            );

            application.setStatus(
                    "Under Verification"
            );

            application.setPaymentStatus(
                    "Paid"
            );

            application.setSubmittedAt(
                    LocalDateTime.now()
            );

            Application savedApplication
                    = applicationRepository.save(
                            application
                    );

            Path applicationDirectory
                    = uploadDirectory.resolve(
                            applicationId
                    );

            Files.createDirectories(
                    applicationDirectory
            );

            saveFile(
                    saleDeed,
                    applicationDirectory,
                    "sale_deed"
            );

            saveFile(
                    identityProof,
                    applicationDirectory,
                    "identity_proof"
            );

            if (additionalDocument != null
                    && !additionalDocument.isEmpty()) {

                saveFile(
                        additionalDocument,
                        applicationDirectory,
                        "additional_document"
                );
            }

            return ResponseEntity
                    .status(201)
                    .body(savedApplication);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Could not save the application and documents."
                    );
        }
    }

    private void saveFile(
            MultipartFile file,
            Path directory,
            String prefix) throws IOException {

        String originalFilename
                = file.getOriginalFilename();

        String extension = "";

        if (originalFilename != null
                && originalFilename.contains(".")) {

            extension
                    = originalFilename.substring(
                            originalFilename.lastIndexOf(".")
                    );
        }

        String filename
                = prefix
                + "_"
                + UUID.randomUUID()
                + extension;

        Path destination
                = directory.resolve(filename);

        Files.copy(
                file.getInputStream(),
                destination,
                StandardCopyOption.REPLACE_EXISTING
        );
    }

    @GetMapping("/{applicationId}")
    public ResponseEntity<?> getApplication(
            @PathVariable String applicationId) {

        Application application
                = applicationRepository
                        .findByApplicationId(
                                applicationId
                        )
                        .orElse(null);

        if (application == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(application);
    }
}
