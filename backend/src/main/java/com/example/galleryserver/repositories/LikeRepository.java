package com.example.galleryserver.repositories;

import com.example.galleryserver.models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPhotoId(String photoId);
    Optional<Like> findByPhotoIdAndUserId(String photoId, String userId);
    void deleteByPhotoIdAndUserId(String photoId, String userId);
}