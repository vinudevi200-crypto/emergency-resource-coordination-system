

package com.emergency.resourcecoordination.service;

import com.emergency.resourcecoordination.entity.Shelter;
import com.emergency.resourcecoordination.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShelterService {

    @Autowired
    private ShelterRepository shelterRepository;

    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

    public Shelter getShelterById(Long id) {
        return shelterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelter not found with id: " + id));
    }

    public Shelter createShelter(Shelter shelter) {
        validateOccupancy(shelter);
        updateStatus(shelter);
        return shelterRepository.save(shelter);
    }

    public Shelter updateShelter(Long id, Shelter updatedShelter) {
        Shelter existing = getShelterById(id);
        existing.setName(updatedShelter.getName());
        existing.setLocation(updatedShelter.getLocation());
        existing.setCapacity(updatedShelter.getCapacity());
        existing.setOccupancy(updatedShelter.getOccupancy());

        validateOccupancy(existing);
        updateStatus(existing);

        return shelterRepository.save(existing);
    }

    public void deleteShelter(Long id) {
        Shelter existing = getShelterById(id);
        shelterRepository.delete(existing);
    }

    // Core validation rule: occupancy cannot exceed capacity
    private void validateOccupancy(Shelter shelter) {
        if (shelter.getOccupancy() > shelter.getCapacity()) {
            throw new IllegalArgumentException(
                "Occupancy (" + shelter.getOccupancy() + ") cannot exceed capacity (" + shelter.getCapacity() + ")"
            );
        }
    }

    // Auto-update status based on occupancy vs capacity
    private void updateStatus(Shelter shelter) {
        if (shelter.getOccupancy().equals(shelter.getCapacity())) {
            shelter.setStatus(Shelter.Status.FULL);
        } else {
            shelter.setStatus(Shelter.Status.OPEN);
        }
    }
}
