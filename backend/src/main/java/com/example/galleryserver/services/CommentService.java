package com.example.galleryserver.services;

import com.example.galleryserver.models.Comment;
import com.example.galleryserver.repositories.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public void addComment(String photoId, String userId, String text) {
        commentRepository.save(new Comment(photoId, userId, text));
    }

    public List<Comment> getComments(String photoId) {
        return commentRepository.findByPhotoId(photoId);
    }
}
