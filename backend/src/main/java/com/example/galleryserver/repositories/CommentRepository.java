package com.example.galleryserver.repositories;

import com.example.galleryserver.models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPhotoId(String photoId);
}
