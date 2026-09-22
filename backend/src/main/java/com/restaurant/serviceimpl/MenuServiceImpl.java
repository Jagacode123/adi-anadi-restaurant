package com.restaurant.serviceimpl;

import com.restaurant.dto.request.CreateCategoryRequest;
import com.restaurant.dto.request.CreateMenuItemRequest;
import com.restaurant.dto.response.MenuCategoryResponse;
import com.restaurant.dto.response.MenuItemResponse;
import com.restaurant.entity.MenuCategory;
import com.restaurant.entity.MenuItem;
import com.restaurant.entity.Restaurant;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.MenuCategoryRepository;
import com.restaurant.repository.MenuItemRepository;
import com.restaurant.repository.RestaurantRepository;
import com.restaurant.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository     itemRepository;
    private final RestaurantRepository   restaurantRepository;

    private Restaurant getRestaurant() {
        return restaurantRepository.findAll().stream()
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not configured. Please run seed data."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuCategoryResponse> getMenuGroupedByCategory() {
        Restaurant restaurant = getRestaurant();
        return categoryRepository
            .findByRestaurantIdAndActiveTrueOrderByDisplayOrderAsc(restaurant.getId())
            .stream()
            .map(cat -> {
                List<MenuItemResponse> items = itemRepository
                    .findByCategoryIdAndAvailableTrueOrderByDisplayOrderAsc(cat.getId())
                    .stream()
                    .map(this::toItemResponse)
                    .collect(Collectors.toList());
                return MenuCategoryResponse.builder()
                    .categoryId(cat.getId())
                    .categoryName(cat.getName())
                    .description(cat.getDescription())
                    .displayOrder(cat.getDisplayOrder())
                    .items(items)
                    .build();
            })
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuCategoryResponse> getAllCategoriesWithItems() {
        Restaurant restaurant = getRestaurant();
        return categoryRepository
            .findByRestaurantIdOrderByDisplayOrderAsc(restaurant.getId())
            .stream()
            .map(cat -> {
                List<MenuItemResponse> items = itemRepository
                    .findByCategoryIdOrderByDisplayOrderAsc(cat.getId())
                    .stream()
                    .map(this::toItemResponse)
                    .collect(Collectors.toList());
                return MenuCategoryResponse.builder()
                    .categoryId(cat.getId())
                    .categoryName(cat.getName())
                    .description(cat.getDescription())
                    .displayOrder(cat.getDisplayOrder())
                    .items(items)
                    .build();
            })
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        return toItemResponse(item);
    }

    @Override
    @Transactional
    public MenuItemResponse createMenuItem(CreateMenuItemRequest request) {
        MenuCategory category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        MenuItem item = new MenuItem();
        item.setCategory(category);
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setImageUrl(request.getImageUrl());
        item.setVegetarian(request.isVegetarian());
        item.setAvailable(request.isAvailable());
        item.setDisplayOrder(request.getDisplayOrder());
        return toItemResponse(itemRepository.save(item));
    }

    @Override
    @Transactional
    public MenuItemResponse updateMenuItem(Long id, CreateMenuItemRequest request) {
        MenuItem item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));

        if (request.getCategoryId() != null) {
            MenuCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            item.setCategory(category);
        }
        if (request.getName()  != null) item.setName(request.getName());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getImageUrl() != null) item.setImageUrl(request.getImageUrl());
        item.setVegetarian(request.isVegetarian());
        item.setAvailable(request.isAvailable());
        item.setDisplayOrder(request.getDisplayOrder());
        return toItemResponse(itemRepository.save(item));
    }

    @Override
    @Transactional
    public void deactivateMenuItem(Long id) {
        MenuItem item = itemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Menu item not found with id: " + id));
        item.setAvailable(false);
        itemRepository.save(item);
    }

    @Override
    @Transactional
    public MenuCategoryResponse createCategory(CreateCategoryRequest request) {
        Restaurant restaurant = getRestaurant();
        MenuCategory cat = new MenuCategory();
        cat.setRestaurant(restaurant);
        cat.setName(request.getName());
        cat.setDescription(request.getDescription());
        cat.setDisplayOrder(request.getDisplayOrder());
        cat.setActive(true);
        categoryRepository.save(cat);
        return toCategoryResponse(cat);
    }

    @Override
    @Transactional
    public MenuCategoryResponse updateCategory(Long id, CreateCategoryRequest request) {
        MenuCategory cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        if (request.getName() != null) cat.setName(request.getName());
        if (request.getDescription() != null) cat.setDescription(request.getDescription());
        cat.setDisplayOrder(request.getDisplayOrder());
        return toCategoryResponse(categoryRepository.save(cat));
    }

    @Override
    @Transactional
    public void deactivateCategory(Long id) {
        MenuCategory cat = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        cat.setActive(false);
        categoryRepository.save(cat);
    }

    private MenuItemResponse toItemResponse(MenuItem item) {
        return MenuItemResponse.builder()
            .id(item.getId())
            .categoryId(item.getCategory().getId())
            .categoryName(item.getCategory().getName())
            .name(item.getName())
            .description(item.getDescription())
            .price(item.getPrice())
            .imageUrl(item.getImageUrl())
            .vegetarian(item.isVegetarian())
            .available(item.isAvailable())
            .displayOrder(item.getDisplayOrder())
            .build();
    }

    private MenuCategoryResponse toCategoryResponse(MenuCategory cat) {
        return MenuCategoryResponse.builder()
            .categoryId(cat.getId())
            .categoryName(cat.getName())
            .description(cat.getDescription())
            .displayOrder(cat.getDisplayOrder())
            .items(List.of())
            .build();
    }
}
