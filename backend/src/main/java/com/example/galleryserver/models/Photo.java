package com.example.galleryserver.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Lob;
import java.io.IOException;

@Data
@Document
public class Photo {
    @Id
    private String id;
    @Field(name = "name")
    private String name;
    @Field(name = "tags")
    private String tags;
    @Field(name = "description")
    private String description;
    @Field(name = "user_id")
    private String userid;
    @Field(name = "contentType")
    private String contentType;
    @Lob
    @Field(name = "bytes")
    private byte[] bytes;

    public Photo() {
    }

    public Photo(String name, String tags, String description, String user_id, MultipartFile file) throws IOException {
        this.name = name;
        this.tags = tags;
        this.description = description;
        this.userid = user_id;
        this.bytes = file.getBytes();
        this.contentType = file.getContentType();
    }
}
