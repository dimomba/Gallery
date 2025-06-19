package com.example.galleryserver.controllers;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.galleryserver.security.jwt.AuthTokenFilter;
import com.example.galleryserver.security.services.UserDetailsServiceImpl;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.galleryserver.models.ERole;
import com.example.galleryserver.models.Role;
import com.example.galleryserver.models.User;
import com.example.galleryserver.payload.request.LoginRequest;
import com.example.galleryserver.payload.request.SignupRequest;
import com.example.galleryserver.payload.response.JwtResponse;
import com.example.galleryserver.payload.response.MessageResponse;
import com.example.galleryserver.repositories.RoleRepository;
import com.example.galleryserver.repositories.UserRepository;
import com.example.galleryserver.security.jwt.JwtUtils;
import com.example.galleryserver.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AuthTokenFilter authTokenFilter;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/getuserid")
    public String getUserId(HttpServletRequest request) {
        String jwt = authTokenFilter.parseJwt(request);

        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            String username = jwtUtils.getUserNameFromJwtToken(jwt);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (userDetails instanceof UserDetailsImpl) {
                System.out.println(((UserDetailsImpl) userDetails).getId());
                return ((UserDetailsImpl) userDetails).getId();
            }
        }
        return "";
    }

    @GetMapping("/getusername")
    public String getUsername(HttpServletRequest request) {
        String jwt = authTokenFilter.parseJwt(request);

        String username = jwtUtils.getUserNameFromJwtToken(jwt);
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        System.out.println(userDetails);

        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
            return jwtUtils.getUserNameFromJwtToken(jwt);
        }
        return "";
    }

    @GetMapping("/getuserid/{username}")
    public String getUserid(@PathVariable String username) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        System.out.println(userDetails);
        return ((UserDetailsImpl) userDetails).getId();
    }

    @GetMapping("/getuserdetails")
    public UserDetails getUserdetails(HttpServletRequest request) {
        String jwt = authTokenFilter.parseJwt(request);

        String username = jwtUtils.getUserNameFromJwtToken(jwt);
        System.out.println("WWWWWWWWWWWWWW");
        return userDetailsService.loadUserByUsername(username);
//        System.out.println(userDetails);
//
//        if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
//            return jwtUtils.getUserNameFromJwtToken(jwt);
//        }
//        return "";
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Данное имя пользователя уже занято"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Аккаунт с таким адресом эл. почты уже существует"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER) //тут поменять на ROLE_ADMIN
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}