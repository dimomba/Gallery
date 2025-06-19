package com.example.galleryserver.controllers;

import com.example.galleryserver.security.jwt.AuthTokenFilter;
import com.example.galleryserver.security.jwt.JwtUtils;
import com.example.galleryserver.security.services.UserDetailsServiceImpl;
import com.example.galleryserver.services.AlbumService;
import com.example.galleryserver.models.Album;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.example.galleryserver.services.PublicationService;
import com.example.galleryserver.models.Photo;


import java.util.List;

@RestController
@RequestMapping("/api/album")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AlbumController {
    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthTokenFilter authTokenFilter;
    private final AlbumService albumService;

    private final PublicationService photoService;  // Сервис для работы с фотографиями

    public AlbumController(AlbumService albumService, PublicationService photoService) {
        this.albumService = albumService;
        this.photoService = photoService;
    }

    // Получение альбома по ID с фотографиями
    @GetMapping("/{albumId}")
    public ResponseEntity<List<Photo>> getPhotosFromAlbumById(@PathVariable String albumId) {
        Album album = albumService.getAlbumById(albumId);  // Получаем альбом
        List<Photo> photos = photoService.getPhotosByIds(album.getPhotoIds()); // Получаем фотографии по ID
        //album.setPhotoIds(photos); // Добавляем фотографии в альбом
        return ResponseEntity.ok(photos);
    }

    // Создание альбома
    @PostMapping("/album")
    public ResponseEntity<Album> createAlbum(@RequestBody Album album) {
        Album alb = albumService.createAlbum(album.getUserId(), album.getName());
        return ResponseEntity.ok(alb);
    }

    // Удаление альбома
    @DeleteMapping("/{albumId}")
    public ResponseEntity<Void> deleteAlbum(@PathVariable String albumId) {
        albumService.deleteAlbum(albumId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // Добавление фотографии в альбом
    @PostMapping("/{albumId}/addPhoto")
    public ResponseEntity<Void> addPhotoToAlbum(@PathVariable String albumId, @RequestParam String photoId) {
        System.out.println("addPhotoToAlbum");
        albumService.addPhotoToAlbum(albumId, photoId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{albumId}/removePhoto")
    public ResponseEntity<Void> removePhotoFromAlbum(@PathVariable String albumId, @RequestParam String photoId) {
        albumService.removePhotoFromAlbum(albumId, photoId);
        return ResponseEntity.noContent().build();
    }

    // Создание копии альбома для другого пользователя
    @PostMapping("/{albumId}/copy")
    public ResponseEntity<Album> createAlbumForCurrentUser(@PathVariable String albumId, HttpServletRequest request) {
        String jwt = authTokenFilter.parseJwt(request);
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            String userId = userDetailsService.getUserIdByUsername(username);
            Album newAlbum = albumService.createAlbumForUser(albumId, userId);
            if (newAlbum != null) {
                return ResponseEntity.status(HttpStatus.CREATED).body(newAlbum);
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/{albumId}/name")
    public ResponseEntity<String> getAlbumNameById(@PathVariable String albumId) {
        Album album = albumService.getAlbumById(albumId);
        if (album == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Album not found");
        }
        return ResponseEntity.ok(album.getName());
    }

    // Получение альбомов пользователя
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Album>> getAlbumsByUserId(@PathVariable String userId) {
        List<Album> albums = albumService.getAlbumsByUserId(userId);
        System.out.println(albums);
        return ResponseEntity.ok(albums);
    }

    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    @GetMapping("/isityouralbum/{id}")
    public Boolean isItYourAlbum(@PathVariable String id, HttpServletRequest request) {
        String jwt = authTokenFilter.parseJwt(request);
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            System.out.println(userDetails.getAuthorities());
            if (userDetails.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"))) {
                return true; // Если у пользователя есть роль "ADMIN", возвращаем true
            }
            return userDetails.getUsername().equals(userDetailsService.getUsernameByUserId(
                    albumService.getAlbumById(id).getUserId()));
        }
        return false;
    }

}
