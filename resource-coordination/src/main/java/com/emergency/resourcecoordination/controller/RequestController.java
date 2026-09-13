

package com.emergency.resourcecoordination.controller;

import com.emergency.resourcecoordination.entity.Request;
import com.emergency.resourcecoordination.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "*")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @GetMapping
    public List<Request> getAllRequests() {
        return requestService.getAllRequests();
    }

    @GetMapping("/{id}")
    public Request getRequestById(@PathVariable Long id) {
        return requestService.getRequestById(id);
    }

    @PostMapping("/resource/{resourceId}")
    public Request createRequest(@PathVariable Long resourceId, @Valid @RequestBody Request request) {
        return requestService.createRequest(resourceId, request);
    }

    @PutMapping("/{id}/fulfill")
    public Request fulfillRequest(@PathVariable Long id) {
        return requestService.fulfillRequest(id);
    }

    @PutMapping("/{id}/reject")
    public Request rejectRequest(@PathVariable Long id) {
        return requestService.rejectRequest(id);
    }

    @DeleteMapping("/{id}")
    public String deleteRequest(@PathVariable Long id) {
        requestService.deleteRequest(id);
        return "Request deleted successfully";
    }
}