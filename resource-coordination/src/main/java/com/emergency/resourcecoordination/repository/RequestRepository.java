
package com.emergency.resourcecoordination.repository;

import com.emergency.resourcecoordination.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
}