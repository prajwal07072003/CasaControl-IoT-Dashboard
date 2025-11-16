package com.casacontrol.casacontrol.controller;

import com.casacontrol.casacontrol.dto.ScheduleCreateRequest;
import com.casacontrol.casacontrol.entity.Schedule;
import com.casacontrol.casacontrol.repository.ScheduleRepository;
import com.casacontrol.casacontrol.service.ScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/schedules")
@CrossOrigin("*")
public class ScheduleController {

    private final ScheduleRepository repo;
    private final ScheduleService service;

    public ScheduleController(ScheduleRepository repo, ScheduleService service) {
        this.repo = repo;
        this.service = service;
    }

    @GetMapping
    public List<Schedule> all() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<Schedule> create(@RequestBody ScheduleCreateRequest req) {
        if (req == null || req.actions == null || req.actions.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (req.time == null || req.time.length() != 5) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(service.create(req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/enabled")
    public ResponseEntity<Schedule> enable(@PathVariable Long id, @RequestParam boolean enabled) {
        var s = repo.findById(id).orElse(null);
        if (s == null) return ResponseEntity.notFound().build();
        s.setEnabled(enabled);
        repo.save(s);
        return ResponseEntity.ok(s);
    }
}
