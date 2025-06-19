package com.example.galleryserver.services;

import com.example.galleryserver.models.Photo;
import com.example.galleryserver.repositories.PublicationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PublicationService {
    private final PublicationRepository publicationRepository;
    public PublicationService(PublicationRepository publicationRepository) {
        this.publicationRepository = publicationRepository;
    }
    public void addPhoto(Photo photo) {
        publicationRepository.insert(photo);
    }

    public Page<Photo> getPhotosWithPagination(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return publicationRepository.findAll(pageable);
    }
    public List<Photo> getAllPhotos() {
        return publicationRepository.findAll();
    }

    public Photo getPhotoById(String id) {
        Optional<Photo> photo = publicationRepository.findById(id);
        Photo photo1 = photo.orElse(null);
        return photo1;
    }

//    public List<Publication> findPhotosByTags(String tags) {
//        System.out.println(tags);
//        return publicationRepository.findPhotosByTags(tags);
//    }

    public List<Photo> findPublicationsByTags(String tags) {
        String[] searchTags = tags.toLowerCase().split("\\s+");
        List<Photo> allPhotos = publicationRepository.findAll();

        return allPhotos.stream()
                .filter(photo -> {
                    if (photo.getTags() == null && photo.getName() == null) return false;

                    Set<String> publicationWords = new HashSet<>();

                    if (photo.getTags() != null) {
                        publicationWords.addAll(Arrays.asList(photo.getTags().toLowerCase().split("\\s+")));
                    }

                    if (photo.getName() != null) {
                        publicationWords.addAll(Arrays.asList(photo.getName().toLowerCase().split("\\s+")));
                    }

                    if (searchTags.length == 1) {
                        return publicationWords.contains(searchTags[0]);
                    } else {
                        return Arrays.stream(searchTags).allMatch(publicationWords::contains);
                    }
                })
                .collect(Collectors.toList());
    }

    public List<Photo> findPublicationsByUserid(String userid) {
        return publicationRepository.findPhotosByUserid(userid);
    }

    public void deletePhoto(String id) {
        publicationRepository.deleteById(id);
    }

    // Получение фотографий по их ID
    public List<Photo> getPhotosByIds(List<String> photoIds) {
        return publicationRepository.findAllById(photoIds);
    }
}
