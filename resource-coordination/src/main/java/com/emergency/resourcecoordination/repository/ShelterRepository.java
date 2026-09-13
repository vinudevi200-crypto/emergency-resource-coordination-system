

package com.emergency.resourcecoordination.repository;

import com.emergency.resourcecoordination.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShelterRepository extends JpaRepository<Shelter, Long> {
}