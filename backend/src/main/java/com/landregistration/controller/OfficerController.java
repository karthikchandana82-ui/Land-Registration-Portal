package com.landregistration.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.landregistration.backend.model.Application;
import com.landregistration.backend.repository.ApplicationRepository;

@RestController
@RequestMapping("/api/officer")
@CrossOrigin(origins = "*")
public class OfficerController {

    private final ApplicationRepository applicationRepository;

    /*
     * Uploaded documents are stored here:
     *
     * uploads/
     *   applications/
     *       LR20260923ABC123/
     *           sale_deed_xxxxx.pdf
     *           identity_proof_xxxxx.jpg
     *           additional_document_xxxxx.pdf
     */
    private final Path uploadDirectory
            = Paths.get("uploads", "applications");

    public OfficerController(
            ApplicationRepository applicationRepository) {

        this.applicationRepository
                = applicationRepository;
    }

    // =========================================================
    // OFFICER LOGIN
    // =========================================================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        if (request == null
                || request.username() == null
                || request.password() == null) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            new ErrorResponse(
                                    "Username and password are required."
                            )
                    );
        }

        /*
         * Demo officer credentials.
         *
         * Authentication is handled by Spring Boot.
         */
        String correctUsername = System.getenv("OFFICER_USERNAME");
        String correctPassword = System.getenv("OFFICER_PASSWORD");

        if (!correctUsername.equals(request.username())
                || !correctPassword.equals(request.password())) {

            return ResponseEntity
                    .status(401)
                    .body(
                            new ErrorResponse(
                                    "Invalid username or password."
                            )
                    );
        }

        return ResponseEntity.ok(
                new LoginResponse(
                        "Login successful.",
                        true
                )
        );
    }

    // =========================================================
    // GET PENDING APPLICATIONS
    // =========================================================
    @GetMapping("/applications")
    public ResponseEntity<List<Application>>
            getPendingApplications() {

        List<Application> applications
                = applicationRepository
                        .findByStatusOrderBySubmittedAtDesc(
                                "Under Verification"
                        );

        return ResponseEntity.ok(applications);
    }

    // =========================================================
    // APPROVE AND REGISTER
    // =========================================================
    @PatchMapping(
            "/applications/{applicationId}/register"
    )
    public ResponseEntity<?> registerApplication(
            @PathVariable String applicationId) {

        Application application
                = applicationRepository
                        .findByApplicationId(applicationId)
                        .orElse(null);

        if (application == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!"Under Verification"
                .equals(application.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Application is already processed."
                    );
        }

        application.setStatus("Registered");

        application.setRegisteredAt(
                LocalDateTime.now()
        );

        Application saved
                = applicationRepository.save(application);

        return ResponseEntity.ok(saved);
    }

    // =========================================================
    // REJECT APPLICATION
    // =========================================================
    @PatchMapping(
            "/applications/{applicationId}/reject"
    )
    public ResponseEntity<?> rejectApplication(
            @PathVariable String applicationId,
            @RequestBody RejectRequest request) {

        if (request == null
                || request.reason() == null
                || request.reason().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Rejection reason is required."
                    );
        }

        Application application
                = applicationRepository
                        .findByApplicationId(applicationId)
                        .orElse(null);

        if (application == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (!"Under Verification"
                .equals(application.getStatus())) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Application is already processed."
                    );
        }

        application.setStatus("Rejected");

        application.setRejectionReason(
                request.reason().trim()
        );

        application.setRejectedAt(
                LocalDateTime.now()
        );

        Application saved
                = applicationRepository.save(application);

        return ResponseEntity.ok(saved);
    }

    // =========================================================
    // VIEW APPLICATION DOCUMENT
    // =========================================================
    //
    // Examples:
    //
    // GET
    // /api/officer/applications/LR20260923ABC123/documents/sale_deed
    //
    // GET
    // /api/officer/applications/LR20260923ABC123/documents/identity_proof
    //
    // GET
    // /api/officer/applications/LR20260923ABC123/documents/additional_document
    //
    // =========================================================
    @GetMapping(
            "/applications/{applicationId}/documents/{documentType}"
    )
    public ResponseEntity<?> viewDocument(
            @PathVariable String applicationId,
            @PathVariable String documentType) {

        try {

            // -------------------------------------------------
            // 1. Verify application exists
            // -------------------------------------------------
            Application application
                    = applicationRepository
                            .findByApplicationId(applicationId)
                            .orElse(null);

            if (application == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            // -------------------------------------------------
            // 2. Allow only known document types
            // -------------------------------------------------
            String prefix;

            switch (documentType.toLowerCase(Locale.ROOT)) {

                case "sale_deed":
                    prefix = "sale_deed_";
                    break;

                case "identity_proof":
                    prefix = "identity_proof_";
                    break;

                case "additional_document":
                    prefix = "additional_document_";
                    break;

                default:

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    "Invalid document type."
                            );
            }

            // -------------------------------------------------
            // 3. Build application directory
            // -------------------------------------------------
            Path applicationDirectory
                    = uploadDirectory.resolve(applicationId)
                            .normalize();

            /*
             * Make sure the resolved directory remains inside
             * the upload directory.
             */
            Path normalizedUploadDirectory
                    = uploadDirectory
                            .toAbsolutePath()
                            .normalize();

            Path normalizedApplicationDirectory
                    = applicationDirectory
                            .toAbsolutePath()
                            .normalize();

            if (!normalizedApplicationDirectory
                    .startsWith(normalizedUploadDirectory)) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid application path."
                        );
            }

            // -------------------------------------------------
            // 4. Check application folder
            // -------------------------------------------------
            if (!Files.exists(applicationDirectory)
                    || !Files.isDirectory(applicationDirectory)) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            // -------------------------------------------------
            // 5. Find document by its safe prefix
            // -------------------------------------------------
            Path documentPath = null;

            try (Stream<Path> files
                    = Files.list(applicationDirectory)) {

                documentPath = files
                        .filter(Files::isRegularFile)
                        .filter(
                                path
                                -> path.getFileName()
                                        .toString()
                                        .startsWith(prefix)
                        )
                        .findFirst()
                        .orElse(null);
            }

            if (documentPath == null) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            // -------------------------------------------------
            // 6. Convert file into Spring Resource
            // -------------------------------------------------
            Resource resource
                    = new UrlResource(
                            documentPath
                                    .toAbsolutePath()
                                    .toUri()
                    );

            if (!resource.exists()
                    || !resource.isReadable()) {

                return ResponseEntity
                        .notFound()
                        .build();
            }

            // -------------------------------------------------
            // 7. Determine file type
            // -------------------------------------------------
            String contentType
                    = Files.probeContentType(documentPath);

            if (contentType == null) {

                contentType
                        = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            // -------------------------------------------------
            // 8. Return document for browser viewing
            // -------------------------------------------------
            String filename
                    = documentPath
                            .getFileName()
                            .toString();

            return ResponseEntity.ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            ContentDisposition
                                    .inline()
                                    .filename(filename)
                                    .build()
                                    .toString()
                    )
                    .body(resource);

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unable to open the requested document."
                    );
        }
    }

    // =========================================================
    // REQUEST / RESPONSE RECORDS
    // =========================================================
    public record LoginRequest(
            String username,
            String password
            ) {

    }

    public record LoginResponse(
            String message,
            boolean success
            ) {

    }

    public record ErrorResponse(
            String error
            ) {

    }

    public record RejectRequest(
            String reason
            ) {

    }
}
