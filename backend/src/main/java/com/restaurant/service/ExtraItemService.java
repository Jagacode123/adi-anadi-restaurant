package com.restaurant.service;

import com.restaurant.dto.request.CreateExtraItemRequest;
import com.restaurant.dto.response.ExtraItemResponse;

import java.util.List;

public interface ExtraItemService {

    List<ExtraItemResponse> getAvailableExtraItems();

    ExtraItemResponse createExtraItem(CreateExtraItemRequest request);

    ExtraItemResponse updateExtraItem(Long id, CreateExtraItemRequest request);

    void deactivateExtraItem(Long id);
}
