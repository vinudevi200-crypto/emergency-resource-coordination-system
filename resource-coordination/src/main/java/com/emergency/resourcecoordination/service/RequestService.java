

package com.emergency.resourcecoordination.service;

import com.emergency.resourcecoordination.entity.Request;
import com.emergency.resourcecoordination.entity.Resource;
import com.emergency.resourcecoordination.repository.RequestRepository;
import com.emergency.resourcecoordination.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestService {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public Request getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    public Request createRequest(Long resourceId, Request request) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + resourceId));

        request.setResource(resource);
        request.setRequestDate(LocalDateTime.now());
        request.setStatus(Request.Status.PENDING);

        return requestRepository.save(request);
    }

    public Request fulfillRequest(Long id) {
        Request request = getRequestById(id);
        Resource resource = request.getResource();

        if (request.getQuantityNeeded() > resource.getQuantityAvailable()) {
            throw new IllegalArgumentException(
                "Cannot fulfill request: quantity needed (" + request.getQuantityNeeded() +
                ") exceeds available stock (" + resource.getQuantityAvailable() + ")"
            );
        }

        // Auto-decrement stock
        resource.setQuantityAvailable(resource.getQuantityAvailable() - request.getQuantityNeeded());

        // Update resource status based on remaining quantity
        if (resource.getQuantityAvailable() == 0) {
            resource.setStatus(Resource.Status.DEPLETED);
        } else if (resource.getQuantityAvailable() < 20) {
            resource.setStatus(Resource.Status.LOW);
        }

        resource.setLastUpdated(LocalDateTime.now());
        resourceRepository.save(resource);

        request.setStatus(Request.Status.FULFILLED);
        return requestRepository.save(request);
    }

    public Request rejectRequest(Long id) {
        Request request = getRequestById(id);
        request.setStatus(Request.Status.REJECTED);
        return requestRepository.save(request);
    }

    public void deleteRequest(Long id) {
        Request request = getRequestById(id);
        requestRepository.delete(request);
    }
}