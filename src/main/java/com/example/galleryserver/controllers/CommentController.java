package com.example.galleryserver.controllers;

import com.example.galleryserver.models.Comment;
import com.example.galleryserver.security.jwt.AuthTokenFilter;
import com.example.galleryserver.security.jwt.JwtUtils;
import com.example.galleryserver.security.services.UserDetailsServiceImpl;
import com.example.galleryserver.services.CommentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentController {

    @Autowired
    private CommentService commentService;

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
    public ResponseEntity<?> addComment(@PathVariable String photoId, @RequestBody String text, HttpServletRequest request) {
        String userId = getUserIdFromRequest(request);
        if (userId != null) {
            commentService.addComment(photoId, userId, text);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(401).build();
    }

    @GetMapping("/{photoId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String photoId) {
        return ResponseEntity.ok(commentService.getComments(photoId));
    }
}
