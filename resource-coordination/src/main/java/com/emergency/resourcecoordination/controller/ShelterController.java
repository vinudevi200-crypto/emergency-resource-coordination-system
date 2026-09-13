
package com.emergency.resourcecoordination.controller;

import com.emergency.resourcecoordination.entity.Shelter;
import com.emergency.resourcecoordination.service.ShelterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shelters")
@CrossOrigin(origins = "*")
public class ShelterController {

    @Autowired
    private ShelterService shelterService;

    @GetMapping
    public List<Shelter> getAllShelters() {
        return shelterService.getAllShelters();
    }

    @GetMapping("/{id}")
    public Shelter getShelterById(@PathVariable Long id) {
        return shelterService.getShelterById(id);
    }

    @PostMapping
    public Shelter createShelter(@Valid @RequestBody Shelter shelter) {
        return shelterService.createShelter(shelter);
    }

    @PutMapping("/{id}")
    public Shelter updateShelter(@PathVariable Long id, @Valid @RequestBody Shelter shelter) {
        return shelterService.updateShelter(id, shelter);
    }

    @DeleteMapping("/{id}")
    public String deleteShelter(@PathVariable Long id) {
        shelterService.deleteShelter(id);
        return "Shelter deleted successfully";
    }
}