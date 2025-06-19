package com.example.galleryserver.controllers;

import com.example.galleryserver.models.Photo;
import com.example.galleryserver.security.jwt.AuthTokenFilter;
import com.example.galleryserver.security.jwt.JwtUtils;
import com.example.galleryserver.security.services.UserDetailsServiceImpl;
import com.example.galleryserver.services.PublicationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.Base64;
import java.util.List;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;



@RestController
@RequestMapping("/api/photo")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicationController {
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthTokenFilter authTokenFilter;
    private final PublicationService publicationService;
    public PublicationController(PublicationService publicationService) {
        this.publicationService = publicationService;
    }


    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity addPhoto(
            @RequestParam("name") String name,
            @RequestParam("tags") String tags,
            @RequestParam("description") String description,
            @RequestParam("user_id") String user_id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            Photo photo = new Photo(name, tags, description, user_id, file);
            publicationService.addPhoto(photo);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing the file");
        }
    }



//    @GetMapping СТАРОЕ РАБОЧЕЕ
//    public ResponseEntity<List<Photo>> getAllPhotos() {
//        return ResponseEntity.ok(publicationService.getAllPhotos());
//    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPhotos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Photo> photoPage = publicationService.getPhotosWithPagination(page, size);
        Map<String, Object> response = new HashMap<>();
        response.put("photos", photoPage.getContent());
        response.put("currentPage", photoPage.getNumber());
        response.put("totalItems", photoPage.getTotalElements());
        response.put("totalPages", photoPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

//    @GetMapping("/getFields/{id}")
//    public ResponseEntity<Photo> getFieldsById(@PathVariable String id) {
//        Photo photo = photoService.getPhotoById(id);
//        return ResponseEntity.ok().body(photo);
//    }
    @GetMapping("/getPost/{id}")
    public ResponseEntity<Map<String, Object>> getFieldsById(@PathVariable String id) {
        Photo photo = publicationService.getPhotoById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("name", photo.getName());
        response.put("tags", photo.getTags());
        response.put("description", photo.getDescription());
        response.put("username", userDetailsService.getUsernameByUserId(photo.getUserid()));
        response.put("image", Base64.getEncoder().encodeToString(photo.getBytes()));
        response.put("type", photo.getContentType());
        System.out.println("getPost");
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/getImage/{id}")
    public ResponseEntity<?> getImageById(@PathVariable String id) {
        Photo photo = publicationService.getPhotoById(id);
        System.out.println("getImage");
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(photo.getContentType()))
                .body(new InputStreamResource(new ByteArrayInputStream(photo.getBytes())));
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity deletePhoto(@PathVariable String id, HttpServletRequest request) {
        String jwt = authTokenFilter.parseJwt(request);
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (userDetails.getUsername().equals(userDetailsService.getUsernameByUserId(
                    publicationService.getPhotoById(id).getUserid())))  {
                publicationService.deletePhoto(id);
            } else if ((userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN")))) {
                publicationService.deletePhoto(id);
            }
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/isityourphoto/{id}")
    public Boolean isItYourPhoto(@PathVariable String id, HttpServletRequest request) {
        String jwt = authTokenFilter.parseJwt(request);
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            System.out.println(userDetails.getAuthorities());
            if (userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"))) {
                return true; // Если у пользователя есть роль "ADMIN", возвращаем true
            }
            return userDetails.getUsername().equals(userDetailsService.getUsernameByUserId(
                    publicationService.getPhotoById(id).getUserid()));
        }
        return false;
    }


    @GetMapping("/getUsername/{id}")
    public String getUsername(@PathVariable String id) {
        System.out.println("getUsername");
        return userDetailsService.getUsernameByUserId(id);
    }


    @GetMapping("/search/{tags}")
    public ResponseEntity<List<Photo>> getPublicationsByTags(@PathVariable String tags) {
        try {
            List<Photo> photos = publicationService.findPublicationsByTags(tags);
            return ResponseEntity.ok().body(photos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/searchbyuserid/{userid}")
    public ResponseEntity<List<Photo>> getPublicationsByUserid(@PathVariable String userid) {
        try {
            List<Photo> photos = publicationService.findPublicationsByUserid(userid);
            return ResponseEntity.ok().body(photos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
