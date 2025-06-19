package com.example.galleryserver.controllers;

import com.example.galleryserver.security.jwt.AuthTokenFilter;
import com.example.galleryserver.security.jwt.JwtUtils;
import com.example.galleryserver.services.LikeService;
import com.example.galleryserver.security.services.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/like")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LikeController {

    @Autowired
    private LikeService likeService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthTokenFilter authTokenFilter;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private String getUserIdFromRequest(HttpServletRequest request) {
        String jwt = authTokenFilter.parseJwt(request);
        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            return userDetailsService.getUserIdByUsername(username);
        }
        return null;
    }

    @PostMapping("/{photoId}")
    public ResponseEntity<?> likePhoto(@PathVariable String photoId, HttpServletRequest request) {
        String userId = getUserIdFromRequest(request);
        if (userId != null) {
            likeService.addLike(photoId, userId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }

    @DeleteMapping("/{photoId}")
    public ResponseEntity<?> unlikePhoto(@PathVariable String photoId, HttpServletRequest request) {
        String userId = getUserIdFromRequest(request);
        if (userId != null) {
            likeService.removeLike(photoId, userId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }

    @GetMapping("/count/{photoId}")
    public ResponseEntity<Integer> getLikeCount(@PathVariable String photoId) {
        return ResponseEntity.ok(likeService.countLikes(photoId));
    }

    @GetMapping("/isLiked/{photoId}")
    public ResponseEntity<Boolean> isPhotoLikedByUser(@PathVariable String photoId, HttpServletRequest request) {
        String userId = getUserIdFromRequest(request);
        if (userId != null) {
            return ResponseEntity.ok(likeService.isLikedByUser(photoId, userId));
        }
        return ResponseEntity.status(401).build();
    }
}