package com.example.galleryserver.services;

import com.example.galleryserver.models.Album;
import com.example.galleryserver.repositories.AlbumRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AlbumService {
    private final AlbumRepository albumRepository;

    public AlbumService(AlbumRepository albumRepository) {
        this.albumRepository = albumRepository;
    }

    // Создание нового альбома
    public Album createAlbum(String userId, String name) {
        Album album = new Album(userId);
        album.setName(name);
        return albumRepository.save(album);
    }

    // Удаление альбома
    public void deleteAlbum(String albumId) {
        albumRepository.deleteById(albumId);
    }

    // Добавление фотографии в альбом
    public void addPhotoToAlbum(String albumId, String photoId) {
        Optional<Album> albumOptional = albumRepository.findById(albumId);
        if (albumOptional.isPresent()) {
            Album album = albumOptional.get();
            if (album.getPhotoIds() == null) {
                album.setPhotoIds(new ArrayList<>());
            }
            System.out.println("addPhotoToAlbumService1");
            album.getPhotoIds().add(photoId);
            System.out.println("addPhotoToAlbumService2");
            albumRepository.save(album);
            System.out.println("addPhotoToAlbumService3");
        }
    }

    // Создание копии альбома для другого пользователя
//    public Album createAlbumForUser(String albumId, String newUserId) {
//        Optional<Album> albumOptional = albumRepository.findById(albumId);
//        if (albumOptional.isPresent()) {
//            Album originalAlbum = albumOptional.get();
//            Album newAlbum = new Album(newUserId);
//            newAlbum.setPhotoIds(originalAlbum.getPhotoIds()); // Копируем все фотографии из оригинального альбома
//            return albumRepository.save(newAlbum);
//        }
//        return null;
//    }

    // Получение альбомов по userId
    public List<Album> getAlbumsByUserId(String userId) {
        return albumRepository.findByUserId(userId);
    }

    public Album getAlbumById(String albumId) {
        Optional<Album> album = albumRepository.findById(albumId);
        return album.orElse(null);
    }

    public Album createAlbumForUser(String sourceAlbumId, String newUserId) {
        Album sourceAlbum = getAlbumById(sourceAlbumId);
        if (sourceAlbum == null) {
            return null;
        }

        // Создаем новый альбом для пользователя с таким же именем
        Album newAlbum = createAlbum(newUserId, sourceAlbum.getName());

        // Копируем фотографии
        newAlbum.setPhotoIds(new ArrayList<>(sourceAlbum.getPhotoIds()));

        // Сохраняем обновлённый альбом с фотографиями
        return albumRepository.save(newAlbum);
    }

    public void removePhotoFromAlbum(String albumId, String photoId) {
        Album album = albumRepository.findById(albumId).orElseThrow(() -> new RuntimeException("Album not found"));
        album.getPhotoIds().remove(photoId);
        albumRepository.save(album);
    }
}