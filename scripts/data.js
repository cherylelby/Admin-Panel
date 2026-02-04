// Data Storage Manager
const DataManager = {
    // Initialize with sample data if localStorage is empty
    init() {
        if (!localStorage.getItem('users')) {
            this.resetUsers();
        }
        if (!localStorage.getItem('products')) {
            this.resetProducts();
        }
    },

    // User Methods
    getUsers() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    },

    saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    },

    addUser(user) {
        const users = this.getUsers();
        user.id = Date.now();
        user.registrationDate = new Date().toISOString();
        users.push(user);
        this.saveUsers(users);
        return user;
    },

    updateUser(id, updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updatedUser };
            this.saveUsers(users);
            return users[index];
        }
        return null;
    },

    deleteUser(id) {
        const users = this.getUsers();
        const filtered = users.filter(u => u.id !== id);
        this.saveUsers(filtered);
    },

    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    },

    // Product Methods
    getProducts() {
        return JSON.parse(localStorage.getItem('products') || '[]');
    },

    saveProducts(products) {
        localStorage.setItem('products', JSON.stringify(products));
    },

    addProduct(product) {
        const products = this.getProducts();
        product.id = Date.now();
        product.dateAdded = new Date().toISOString();
        products.push(product);
        this.saveProducts(products);
        return product;
    },

    updateProduct(id, updatedProduct) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updatedProduct };
            this.saveProducts(products);
            return products[index];
        }
        return null;
    },

    deleteProduct(id) {
        const products = this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        this.saveProducts(filtered);
    },

    getProductById(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    },

    // Reset to sample data
    resetUsers() {
        const sampleUsers = [
            {
                id: 1,
                name: "John Doe",
                email: "john.doe@example.com",
                gender: "male",
                role: "admin",
                status: "active",
                registrationDate: new Date('2024-01-15').toISOString()
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane.smith@example.com",
                gender: "female",
                role: "user",
                status: "active",
                registrationDate: new Date('2024-02-20').toISOString()
            },
            {
                id: 3,
                name: "Michael Johnson",
                email: "michael.j@example.com",
                gender: "male",
                role: "moderator",
                status: "active",
                registrationDate: new Date('2024-03-10').toISOString()
            },
            {
                id: 4,
                name: "Emily Brown",
                email: "emily.brown@example.com",
                gender: "female",
                role: "user",
                status: "inactive",
                registrationDate: new Date('2024-04-05').toISOString()
            },
            {
                id: 5,
                name: "David Wilson",
                email: "david.w@example.com",
                gender: "male",
                role: "user",
                status: "active",
                registrationDate: new Date('2024-05-18').toISOString()
            },
            {
                id: 6,
                name: "Sarah Davis",
                email: "sarah.davis@example.com",
                gender: "female",
                role: "moderator",
                status: "active",
                registrationDate: new Date('2024-06-22').toISOString()
            },
            {
                id: 7,
                name: "Robert Miller",
                email: "robert.m@example.com",
                gender: "male",
                role: "user",
                status: "active",
                registrationDate: new Date('2024-07-14').toISOString()
            },
            {
                id: 8,
                name: "Lisa Anderson",
                email: "lisa.a@example.com",
                gender: "female",
                role: "user",
                status: "active",
                registrationDate: new Date('2024-08-30').toISOString()
            },
            {
                id: 9,
                name: "James Taylor",
                email: "james.t@example.com",
                gender: "male",
                role: "user",
                status: "inactive",
                registrationDate: new Date('2024-09-12').toISOString()
            },
            {
                id: 10,
                name: "Patricia Martinez",
                email: "patricia.m@example.com",
                gender: "female",
                role: "user",
                status: "active",
                registrationDate: new Date().toISOString()
            }
        ];
        this.saveUsers(sampleUsers);
    },

    resetProducts() {
        const sampleProducts = [
            {
                id: 1,
                name: "Laptop Pro X1",
                category: "electronics",
                price: 15000000,
                stock: 25,
                status: "available",
                description: "High-performance laptop with latest Intel processor",
                dateAdded: new Date('2024-01-10').toISOString()
            },
            {
                id: 2,
                name: "Wireless Mouse",
                category: "electronics",
                price: 350000,
                stock: 150,
                status: "available",
                description: "Ergonomic wireless mouse with long battery life",
                dateAdded: new Date('2024-02-15').toISOString()
            },
            {
                id: 3,
                name: "Cotton T-Shirt",
                category: "clothing",
                price: 150000,
                stock: 200,
                status: "available",
                description: "Premium quality cotton t-shirt in various colors",
                dateAdded: new Date('2024-03-20').toISOString()
            },
            {
                id: 4,
                name: "Gaming Keyboard",
                category: "electronics",
                price: 1200000,
                stock: 0,
                status: "out of stock",
                description: "RGB mechanical gaming keyboard",
                dateAdded: new Date('2024-04-05').toISOString()
            },
            {
                id: 5,
                name: "Coffee Beans 1kg",
                category: "food",
                price: 180000,
                stock: 80,
                status: "available",
                description: "Premium arabica coffee beans from Java",
                dateAdded: new Date('2024-05-12').toISOString()
            },
            {
                id: 6,
                name: "Web Development Book",
                category: "books",
                price: 250000,
                stock: 45,
                status: "available",
                description: "Complete guide to modern web development",
                dateAdded: new Date('2024-06-18').toISOString()
            },
            {
                id: 7,
                name: "Denim Jeans",
                category: "clothing",
                price: 450000,
                stock: 75,
                status: "available",
                description: "Classic fit denim jeans for everyday wear",
                dateAdded: new Date('2024-07-22').toISOString()
            },
            {
                id: 8,
                name: "LED Monitor 24\"",
                category: "electronics",
                price: 2500000,
                stock: 30,
                status: "available",
                description: "Full HD LED monitor with IPS panel",
                dateAdded: new Date('2024-08-14').toISOString()
            },
            {
                id: 9,
                name: "Educational Toy Set",
                category: "toys",
                price: 320000,
                stock: 0,
                status: "out of stock",
                description: "Interactive learning toy for children",
                dateAdded: new Date('2024-09-08').toISOString()
            },
            {
                id: 10,
                name: "Smartphone Case",
                category: "electronics",
                price: 120000,
                stock: 300,
                status: "available",
                description: "Protective case for smartphones",
                dateAdded: new Date().toISOString()
            }
        ];
        this.saveProducts(sampleProducts);
    },

    // Statistics Methods
    getStatistics() {
        const users = this.getUsers();
        const products = this.getProducts();
        const today = new Date().toDateString();

        return {
            totalUsers: users.length,
            totalProducts: products.length,
            newUsersToday: users.filter(u => 
                new Date(u.registrationDate).toDateString() === today
            ).length,
            newProductsToday: products.filter(p => 
                new Date(p.dateAdded).toDateString() === today
            ).length,
            maleUsers: users.filter(u => u.gender === 'male').length,
            femaleUsers: users.filter(u => u.gender === 'female').length
        };
    },

    getRecentUsers(limit = 5) {
        const users = this.getUsers();
        return users
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .slice(0, limit);
    },

    getRecentProducts(limit = 5) {
        const products = this.getProducts();
        return products
            .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded))
            .slice(0, limit);
    }
};

// Initialize data on load
DataManager.init();
