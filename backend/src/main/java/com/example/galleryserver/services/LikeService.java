package com.example.galleryserver.services;

import com.example.galleryserver.models.Like;
import com.example.galleryserver.repositories.LikeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LikeService {
    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public void addLike(String photoId, String userId) {
        if (likeRepository.findByPhotoIdAndUserId(photoId, userId).isEmpty()) {
            likeRepository.insert(new Like(photoId, userId));
        }
    }

    public void removeLike(String photoId, String userId) {
        likeRepository.deleteByPhotoIdAndUserId(photoId, userId);
    }

    public int countLikes(String photoId) {
        return likeRepository.findByPhotoId(photoId).size();
    }

    public boolean isLikedByUser(String photoId, String userId) {
        return likeRepository.findByPhotoIdAndUserId(photoId, userId).isPresent();
    }
}
