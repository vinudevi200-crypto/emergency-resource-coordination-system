package com.emergency.resourcecoordination.service;



import com.emergency.resourcecoordination.entity.Resource;
import com.emergency.resourcecoordination.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    public Resource createResource(Resource resource) {
        resource.setLastUpdated(LocalDateTime.now());
        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, Resource updatedResource) {
        Resource existing = getResourceById(id);
        existing.setResourceType(updatedResource.getResourceType());
        existing.setQuantityAvailable(updatedResource.getQuantityAvailable());
        existing.setUnit(updatedResource.getUnit());
        existing.setLocation(updatedResource.getLocation());
        existing.setStatus(updatedResource.getStatus());
        existing.setLastUpdated(LocalDateTime.now());
        return resourceRepository.save(existing);
    }

    public void deleteResource(Long id) {
        Resource existing = getResourceById(id);
        resourceRepository.delete(existing);
    }
}