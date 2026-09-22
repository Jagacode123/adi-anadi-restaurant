package com.restaurant.config;

import com.restaurant.entity.*;
import com.restaurant.enums.OrderStatus;
import com.restaurant.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final TimeSlotCapacityRepository slotRepository;
    private final MenuCategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;
    private final ExtraItemRepository extraItemRepository;
    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final ReviewRepository            reviewRepository;
    private final PasswordEncoder             passwordEncoder;
    private final Clock                       applicationClock;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.findByName("ADMIN").isPresent()) {
            log.info("Database already initialized.");
            return;
        }

        log.info("Initializing in-memory database with default seed data...");

        // 1. Roles
        Role adminRole = roleRepository.save(new Role("ADMIN"));
        Role customerRole = roleRepository.save(new Role("CUSTOMER"));

        // 2. Users
        User admin = new User();
        admin.setName("Adi Anadi Admin");
        admin.setEmail("admin@adianadi.com");
        admin.setMobile("9000000001");
        admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
        admin.getRoles().add(adminRole);
        admin = userRepository.save(admin);

        User jagannath = new User();
        jagannath.setName("Jagannath Panda");
        jagannath.setEmail("jagannath@example.com");
        jagannath.setMobile("9876543210");
        jagannath.setPasswordHash(passwordEncoder.encode("Customer@123"));
        jagannath.getRoles().add(customerRole);
        jagannath = userRepository.save(jagannath);

        User priya = new User();
        priya.setName("Priya Sharma");
        priya.setEmail("priya@example.com");
        priya.setMobile("9876543211");
        priya.setPasswordHash(passwordEncoder.encode("Customer@123"));
        priya.getRoles().add(customerRole);
        userRepository.save(priya);

        // 3. Restaurant
        Restaurant restaurant = new Restaurant();
        restaurant.setName("Adi Anadi Restaurant");
        restaurant.setLogoUrl("https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=200");
        restaurant.setPhone("+91-674-2345678");
        restaurant.setEmail("info@adianadi.com");
        restaurant.setAddress("Plot No. 42, Janpath, Bhubaneswar, Odisha - 751001");
        restaurant.setOpeningTime(LocalTime.of(11, 0));
        restaurant.setClosingTime(LocalTime.of(23, 0));
        restaurant.setMinGuests(1);
        restaurant.setMaxGuests(200);
        restaurant.setAdvancePaymentRequired(false);
        restaurant.setAdvancePaymentPercentage(BigDecimal.ZERO);
        restaurant = restaurantRepository.save(restaurant);

        // 4. Time Slot Capacities
        String[] slots = {
            "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
            "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"
        };
        for (String slotStr : slots) {
            TimeSlotCapacity slot = new TimeSlotCapacity();
            slot.setRestaurant(restaurant);
            slot.setSlotTime(LocalTime.parse(slotStr));
            slot.setMaxGuests(50);
            slotRepository.save(slot);
        }

        // 5. Menu Categories
        MenuCategory vegThalis = createCategory(restaurant, "Veg Thalis", "Authentic vegetarian thali meals cooked with traditional Odia spices", 1);
        MenuCategory nonVegThalis = createCategory(restaurant, "Non-Veg Thalis", "Rich meat, chicken, egg and biryani special thalis", 2);
        MenuCategory seafoodThalis = createCategory(restaurant, "Bhitarkanika Seafood Special", "Fresh estuarine and river fish, prawn, and crab specialities from Bhitarkanika", 3);

        // 6. Menu Items (Exact 12 items requested)
        MenuItem vegThali = createItem(vegThalis, "Veg Thali", "Traditional Odia vegetarian thali with steamed rice, dalma, seasonal veg tarkari, saag bhaja, tomato khatta, papad, salad and sweet", new BigDecimal("99.00"), "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=500", true, 1);
        MenuItem paneerThali = createItem(vegThalis, "Paneer Thali", "Special paneer curry cooked in rich gravy, served with aromatic rice, dalma, seasonal sabzi, roti, salad and dessert", new BigDecimal("129.00"), "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500", true, 2);
        MenuItem mashroomThali = createItem(vegThalis, "Mashroom Thali", "Spiced mushroom masala cooked with regional spices, served with steaming rice, dal, mixed vegetable, roti and salad", new BigDecimal("129.00"), "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500", true, 3);

        MenuItem fishThali = createItem(nonVegThalis, "Fish Thali", "Authentic Odia fresh fish curry (Machha Jhola/Besara) served with rice, dal, crispy fry, salad and chutney", new BigDecimal("99.00"), "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500", false, 1);
        MenuItem eggThali = createItem(nonVegThalis, "Egg Thali", "Two eggs in spicy onion-tomato gravy served with fragrant steamed rice, dal, seasonal bhaja, salad and papad", new BigDecimal("99.00"), "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500", false, 2);
        MenuItem chickenThali = createItem(nonVegThalis, "Chicken Thali", "Home-style chicken curry simmered in fragrant whole spices, served with steamed rice, dal, sabzi and salad", new BigDecimal("129.00"), "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500", false, 3);
        MenuItem desiChickenThali = createItem(nonVegThalis, "Desi chicken Thali", "Special country chicken (Desi Kukkuda) slow-cooked in traditional clay pot style with rich gravy, rice and accompaniments", new BigDecimal("199.00"), "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500", false, 4);
        MenuItem muttonThali = createItem(nonVegThalis, "Mutton Thali", "Signature Odia Mati Handi mutton curry slow-cooked with whole spices, served with steamed rice, dal, salad and papad", new BigDecimal("229.00"), "https://images.unsplash.com/photo-1544025162-d76694265947?w=500", false, 5);
        MenuItem dumBiriyani = createItem(nonVegThalis, "Special Thali Dum Biriyani", "Royal aromatic dum biryani layered with marinated meat, fragrant basmati rice, served with raita, salan and sweet", new BigDecimal("149.00"), "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=500", false, 6);

        MenuItem bhitarkanikaFishThali = createItem(seafoodThalis, "Bhitarkania fish Thali", "Fresh estuary fish from Bhitarkanika cooked in mustard and garlic gravy (Besara), served with steamed rice and accompaniments", new BigDecimal("199.00"), "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500", false, 1);
        MenuItem prawnThali = createItem(seafoodThalis, "Prawn Thali", "Succulent fresh prawns in traditional spicy coconut gravy, served with fragrant steamed rice, dal and sides", new BigDecimal("229.00"), "https://images.unsplash.com/photo-1559742811-822873691df8?w=500", false, 2);
        MenuItem crabThali = createItem(seafoodThalis, "Crab Thali", "Bhitarkanika mud crab cooked in authentic spicy Kankada Jhola, served with steaming hot rice and accompaniments", new BigDecimal("229.00"), "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500", false, 3);

        // 7. Extra Items
        createExtra("Extra Rice", "Plain steamed rice — extra portion", new BigDecimal("60.00"));
        createExtra("Extra Roti", "Additional whole wheat roti", new BigDecimal("15.00"));
        ExtraItem salad = createExtra("Green Salad", "Fresh cucumber, tomato, onion and green chilli salad", new BigDecimal("50.00"));
        createExtra("Papad", "Crispy roasted papad", new BigDecimal("20.00"));
        ExtraItem water = createExtra("Water Bottle", "Packaged drinking water 1 litre", new BigDecimal("20.00"));
        createExtra("Soft Drink", "Can of Coke / Pepsi / Sprite", new BigDecimal("40.00"));

        // 8. Sample Order (Pending)
        Order order = new Order();
        order.setOrderNumber("ORD-10001");
        order.setCustomer(jagannath);
        order.setRestaurant(restaurant);
        order.setGuestCount(4);
        order.setBookingDate(LocalDate.now(applicationClock).plusDays(2));
        order.setBookingTime(LocalTime.of(19, 30));
        order.setSpecialInstructions("Window seat preferred please");
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now(applicationClock));

        OrderItem oi1 = new OrderItem();
        oi1.setOrder(order);
        oi1.setMenuItem(dumBiriyani);
        oi1.setItemName(dumBiriyani.getName());
        oi1.setQuantity(2);
        oi1.setUnitPrice(dumBiriyani.getPrice());
        oi1.setTotalPrice(dumBiriyani.getPrice().multiply(BigDecimal.valueOf(2)));
        order.getItems().add(oi1);

        OrderItem oi2 = new OrderItem();
        oi2.setOrder(order);
        oi2.setMenuItem(paneerThali);
        oi2.setItemName(paneerThali.getName());
        oi2.setQuantity(1);
        oi2.setUnitPrice(paneerThali.getPrice());
        oi2.setTotalPrice(paneerThali.getPrice());
        order.getItems().add(oi2);

        OrderExtraItem oei1 = new OrderExtraItem();
        oei1.setOrder(order);
        oei1.setExtraItem(salad);
        oei1.setItemName(salad.getName());
        oei1.setQuantity(1);
        oei1.setUnitPrice(salad.getPrice());
        oei1.setTotalPrice(salad.getPrice());
        order.getExtraItems().add(oei1);

        OrderExtraItem oei2 = new OrderExtraItem();
        oei2.setOrder(order);
        oei2.setExtraItem(water);
        oei2.setItemName(water.getName());
        oei2.setQuantity(2);
        oei2.setUnitPrice(water.getPrice());
        oei2.setTotalPrice(water.getPrice().multiply(BigDecimal.valueOf(2)));
        order.getExtraItems().add(oei2);

        BigDecimal sub = oi1.getTotalPrice().add(oi2.getTotalPrice());
        BigDecimal extra = oei1.getTotalPrice().add(oei2.getTotalPrice());
        order.setSubtotal(sub);
        order.setExtraTotal(extra);
        order.setGrandTotal(sub.add(extra));

        order = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setOldStatus(null);
        history.setNewStatus(OrderStatus.PENDING.name());
        history.setChangedBy(jagannath);
        history.setChangedAt(LocalDateTime.now(applicationClock));
        historyRepository.save(history);

        // 8. Seed Customer Reviews
        reviewRepository.save(new Review(
            "Soumya Ranjan Mohapatra", "9861001234", 5,
            "Authentic Mati Handi Mutton & Chhena Poda",
            "The mutton was slow-cooked to perfection with deep earthy flavours of clay pot. Ambience is traditional yet classy. Truly the pride of Bhubaneswar!",
            "Dine-in", 14
        ));

        reviewRepository.save(new Review(
            "Priyanka Dash", "9437002345", 5,
            "Best Dalma and Pakhala Thali in Odisha!",
            "Felt like genuine home-cooked food. The Kanika and Dalma were bursting with pure desi ghee aroma. Courteous staff and quick service. Highly recommended!",
            "Family Dinner", 9
        ));

        reviewRepository.save(new Review(
            "Amitav Nayak", "9938003456", 4,
            "Great food and seamless table booking",
            "The online booking process was super smooth without any login hassle. Loved the Crab Curry and fish fry. Will visit again soon with friends.",
            "Dine-in", 6
        ));

        reviewRepository.save(new Review(
            "Rashmi Rekha Sahoo", "9124004567", 5,
            "Wonderful 60th birthday celebration",
            "We booked a table for 8 guests for my father's 60th birthday. The staff made special seating arrangements and the desserts like Rasabali and Chhena Jhili were exceptional!",
            "Celebration", 11
        ));

        reviewRepository.save(new Review(
            "Debasish Panda", "9778005678", 5,
            "Unmatched authentic Odia taste in town",
            "Top tier authentic delicacies with great hygiene, warm Odia hospitality, and very fair pricing. Must try their Mati Handi special!",
            "Quick Bite", 4
        ));

        log.info("Database successfully initialized with admin and sample customer reviews.");
    }

    private MenuCategory createCategory(Restaurant restaurant, String name, String desc, int order) {
        MenuCategory c = new MenuCategory();
        c.setRestaurant(restaurant);
        c.setName(name);
        c.setDescription(desc);
        c.setDisplayOrder(order);
        c.setActive(true);
        return categoryRepository.save(c);
    }

    private MenuItem createItem(MenuCategory category, String name, String desc, BigDecimal price, String img, boolean veg, int order) {
        MenuItem item = new MenuItem();
        item.setCategory(category);
        item.setName(name);
        item.setDescription(desc);
        item.setPrice(price);
        item.setImageUrl(img);
        item.setVegetarian(veg);
        item.setAvailable(true);
        item.setDisplayOrder(order);
        return menuItemRepository.save(item);
    }

    private ExtraItem createExtra(String name, String desc, BigDecimal price) {
        ExtraItem item = new ExtraItem();
        item.setName(name);
        item.setDescription(desc);
        item.setPrice(price);
        item.setAvailable(true);
        return extraItemRepository.save(item);
    }
}
