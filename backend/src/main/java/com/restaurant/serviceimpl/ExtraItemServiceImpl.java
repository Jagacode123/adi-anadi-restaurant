package com.restaurant.serviceimpl;

import com.restaurant.dto.request.CreateExtraItemRequest;
import com.restaurant.dto.response.ExtraItemResponse;
import com.restaurant.entity.ExtraItem;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.ExtraItemRepository;
import com.restaurant.service.ExtraItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExtraItemServiceImpl implements ExtraItemService {

    private final ExtraItemRepository extraItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ExtraItemResponse> getAvailableExtraItems() {
        return extraItemRepository.findByAvailableTrueOrderByNameAsc()
            .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExtraItemResponse createExtraItem(CreateExtraItemRequest request) {
        ExtraItem item = new ExtraItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setAvailable(request.isAvailable());
        return toResponse(extraItemRepository.save(item));
    }

    @Override
    @Transactional
    public ExtraItemResponse updateExtraItem(Long id, CreateExtraItemRequest request) {
        ExtraItem item = extraItemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Extra item not found with id: " + id));
        if (request.getName()  != null) item.setName(request.getName());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        item.setAvailable(request.isAvailable());
        return toResponse(extraItemRepository.save(item));
    }

    @Override
    @Transactional
    public void deactivateExtraItem(Long id) {
        ExtraItem item = extraItemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Extra item not found with id: " + id));
        item.setAvailable(false);
        extraItemRepository.save(item);
    }

    private ExtraItemResponse toResponse(ExtraItem item) {
        return ExtraItemResponse.builder()
            .id(item.getId())
            .name(item.getName())
            .description(item.getDescription())
            .price(item.getPrice())
            .available(item.isAvailable())
            .build();
    }
}
