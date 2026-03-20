console.log("[v0] HomePage.tsx module loaded");

export default function HomePage() {
  console.log("[v0] HomePage component rendering");
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#fff" }}>
      <header style={{ backgroundColor: "#f5f5f5", padding: "20px", borderBottom: "1px solid #e0e0e0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc" }}>EthioMart</h1>
          <nav style={{ display: "flex", gap: "20px" }}>
            <a href="/search" style={{ textDecoration: "none", color: "#333" }}>Search</a>
            <a href="/cart" style={{ textDecoration: "none", color: "#333" }}>Cart</a>
            <a href="/login" style={{ textDecoration: "none", color: "#333" }}>Login</a>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        {/* Hero Section */}
        <section style={{ background: "linear-gradient(135deg, #0066cc 0%, #004fa3 100%)", color: "white", padding: "60px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "20px" }}>Ethiopia's Premium Marketplace</h2>
            <p style={{ fontSize: "18px", marginBottom: "30px", color: "#e8f0ff" }}>
              Shop millions of authentic products from local and global brands. Fast delivery to your doorstep.
            </p>
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
              <a href="/search" style={{ padding: "12px 30px", backgroundColor: "white", color: "#0066cc", textDecoration: "none", borderRadius: "4px", fontWeight: "bold" }}>
                Shop Now
              </a>
              <a href="/search" style={{ padding: "12px 30px", backgroundColor: "transparent", color: "white", border: "2px solid white", textDecoration: "none", borderRadius: "4px", fontWeight: "bold" }}>
                Browse Products
              </a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section style={{ backgroundColor: "#f5f5f5", padding: "40px 20px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "30px" }}>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ fontSize: "32px" }}>🚚</div>
              <div>
                <h4 style={{ fontWeight: "bold", marginBottom: "5px" }}>Fast Delivery</h4>
                <p style={{ color: "#666", fontSize: "14px" }}>Across all regions</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ fontSize: "32px" }}>✅</div>
              <div>
                <h4 style={{ fontWeight: "bold", marginBottom: "5px" }}>Secure Payment</h4>
                <p style={{ color: "#666", fontSize: "14px" }}>Telebirr & CBE Birr</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ fontSize: "32px" }}>⚡</div>
              <div>
                <h4 style={{ fontWeight: "bold", marginBottom: "5px" }}>Daily Deals</h4>
                <p style={{ color: "#666", fontSize: "14px" }}>Save up to 50%</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ fontSize: "32px" }}>📈</div>
              <div>
                <h4 style={{ fontWeight: "bold", marginBottom: "5px" }}>Top Brands</h4>
                <p style={{ color: "#666", fontSize: "14px" }}>100% Authentic</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "15px" }}>Shop by Category</h2>
          <p style={{ color: "#666", marginBottom: "40px" }}>Browse our most popular categories</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
            {["Electronics", "Fashion", "Home & Garden", "Beauty", "Sports", "Books", "Toys", "Food & Drinks"].map((cat) => (
              <div key={cat} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "24px", textAlign: "center", cursor: "pointer", transition: "box-shadow 0.3s" }}>
                <div style={{ width: "64px", height: "64px", background: "linear-gradient(135deg, #80b0ff 0%, #0066cc 100%)", borderRadius: "8px", margin: "0 auto 16px" }}></div>
                <h3 style={{ fontWeight: "600" }}>{cat}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section style={{ backgroundColor: "#0066cc", color: "white", padding: "48px 20px", textAlign: "center", margin: "40px 0" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "15px" }}>Weekend Flash Sale</h2>
          <p style={{ marginBottom: "25px", color: "#e8f0ff" }}>Get up to 60% off on selected items. Limited time only!</p>
          <a href="/search" style={{ padding: "12px 30px", backgroundColor: "white", color: "#0066cc", textDecoration: "none", borderRadius: "4px", fontWeight: "bold", display: "inline-block" }}>
            View Deals
          </a>
        </section>

        {/* Why Shop */}
        <section style={{ padding: "60px 20px", maxWidth: "1200px", margin: "0 auto", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "bold", textAlign: "center", marginBottom: "50px" }}>Why Shop With Us?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "40px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "#0066cc", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px", fontWeight: "bold" }}>✓</div>
              <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>Local Expertise</h3>
              <p style={{ color: "#666" }}>We understand the Ethiopian market and serve our community with pride.</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "#00994d", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px", fontWeight: "bold" }}>✓</div>
              <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>Trusted Sellers</h3>
              <p style={{ color: "#666" }}>All sellers are verified and reviewed. Shop with confidence.</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "#663399", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px", fontWeight: "bold" }}>✓</div>
              <h3 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>Best Prices</h3>
              <p style={{ color: "#666" }}>Price match guarantee. Find the best deals on quality products.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: "#1a1a1a", color: "white", padding: "48px 20px", marginTop: "60px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "32px", marginBottom: "32px" }}>
            <div>
              <h4 style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "16px" }}>EthioMart</h4>
              <p style={{ color: "#999" }}>Your trusted marketplace for quality products and exceptional service.</p>
            </div>
            <div>
              <h4 style={{ fontWeight: "bold", marginBottom: "16px" }}>Quick Links</h4>
              <ul style={{ listStyle: "none", padding: 0, color: "#999" }}>
                <li style={{ marginBottom: "8px" }}><a href="/search" style={{ color: "#999", textDecoration: "none" }}>Shop</a></li>
                <li style={{ marginBottom: "8px" }}><a href="/become-seller" style={{ color: "#999", textDecoration: "none" }}>Become a Seller</a></li>
                <li><a href="/" style={{ color: "#999", textDecoration: "none" }}>Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: "bold", marginBottom: "16px" }}>Customer Service</h4>
              <ul style={{ listStyle: "none", padding: 0, color: "#999" }}>
                <li style={{ marginBottom: "8px" }}><a href="/" style={{ color: "#999", textDecoration: "none" }}>Help Center</a></li>
                <li style={{ marginBottom: "8px" }}><a href="/" style={{ color: "#999", textDecoration: "none" }}>Shipping Info</a></li>
                <li><a href="/" style={{ color: "#999", textDecoration: "none" }}>Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: "bold", marginBottom: "16px" }}>Legal</h4>
              <ul style={{ listStyle: "none", padding: 0, color: "#999" }}>
                <li style={{ marginBottom: "8px" }}><a href="/" style={{ color: "#999", textDecoration: "none" }}>Privacy Policy</a></li>
                <li><a href="/" style={{ color: "#999", textDecoration: "none" }}>Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #333", paddingTop: "32px", textAlign: "center", color: "#999" }}>
            <p>&copy; 2024 EthioMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
