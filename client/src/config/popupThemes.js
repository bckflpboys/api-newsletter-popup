export const popupThemes = {
  Minimal: {
    name: "Minimal",
    themes: [
      {
        id: "minimal-light",
        name: "Light",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        buttonColor: "#2196F3",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {},
      },
      {
        id: "minimal-dark",
        name: "Dark",
        backgroundColor: "#1A1A1A",
        textColor: "#FFFFFF",
        buttonColor: "#2196F3",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {},
      },
      {
        id: "minimal-outline",
        name: "Outline",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        buttonColor: "#FFFFFF",
        buttonTextColor: "#000000",
        backgroundStyle: {
          border: '1px solid #E0E0E0',
          borderRadius: '4px',
        },
      },
    ],
  },
  Modern: {
    name: "Modern",
    themes: [
      {
        id: "modern-gradient-blue",
        name: "Ocean Breeze",
        backgroundColor: "#E3F2FD",
        textColor: "#1A1A1A",
        buttonColor: "#2196F3",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
        },
      },
      {
        id: "modern-gradient-purple",
        name: "Twilight",
        backgroundColor: "#F3E5F5",
        textColor: "#2C1810",
        buttonColor: "#9C27B0",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          borderRadius: "16px",
        },
      },
      {
        id: "modern-blur",
        name: "Frosted",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        buttonColor: "#2563EB",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "16px",
          padding: "32px",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        },
      },
      {
        id: "modern-neumorphic",
        name: "Neumorphic",
        backgroundColor: "#E6E9EF",
        textColor: "#1A1A1A",
        buttonColor: "#2563EB",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          borderRadius: "16px",
          boxShadow: "8px 8px 16px #C3C6CC, -8px -8px 16px #FFFFFF",
        },
      },
    ],
  },
  Vibrant: {
    name: "Vibrant",
    themes: [
      {
        id: "vibrant-pop",
        name: "Pop",
        backgroundColor: "#FF3366",
        textColor: "#FFFFFF",
        buttonColor: "#FFD60A",
        buttonTextColor: "#000000",
        backgroundStyle: {
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(255, 51, 102, 0.3)",
        },
      },
      {
        id: "vibrant-neon",
        name: "Neon",
        backgroundColor: "#0C0C0C",
        textColor: "#00FF88",
        buttonColor: "#FF00FF",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          borderRadius: "12px",
          boxShadow: "0 0 20px rgba(0, 255, 136, 0.5)",
          border: "1px solid #00FF88",
        },
      },
      {
        id: "vibrant-sunset",
        name: "Sunset Glow",
        backgroundColor: "#FFF3E0",
        textColor: "#1A1A1A",
        buttonColor: "#FF5722",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)",
          boxShadow: "0 8px 32px rgba(255, 87, 34, 0.2)",
          borderRadius: "16px",
        },
      },
      {
        id: "vibrant-aurora",
        name: "Aurora",
        backgroundColor: "#E8F5E9",
        textColor: "#1A1A1A",
        buttonColor: "#4CAF50",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)",
          boxShadow: "0 8px 32px rgba(76, 175, 80, 0.2)",
          borderRadius: "16px",
        },
      },
    ],
  },
  Professional: {
    name: "Professional",
    themes: [
      {
        id: "professional-corporate",
        name: "Corporate Blue",
        backgroundColor: "#FFFFFF",
        textColor: "#1E3A8A",
        buttonColor: "#1E3A8A",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(30, 58, 138, 0.1)",
          border: "1px solid #E5E7EB",
        },
      },
      {
        id: "professional-elegant",
        name: "Elegant Dark",
        backgroundColor: "#1C1C1C",
        textColor: "#E5E7EB",
        buttonColor: "#D4AF37",
        buttonTextColor: "#000000",
        backgroundStyle: {
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
        },
      },
      {
        id: "professional-clean",
        name: "Clean Green",
        backgroundColor: "#F0FDF4",
        textColor: "#166534",
        buttonColor: "#166534",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(22, 101, 52, 0.1)",
          border: "1px solid #DCF5E4",
        },
      },
    ],
  },
  Decorative: {
    name: "Decorative",
    themes: [
      {
        id: "decorative-waves",
        name: "Ocean Waves",
        backgroundColor: "#E3F2FD",
        textColor: "#1A1A1A",
        buttonColor: "#1976D2",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
          boxShadow: "0 8px 32px rgba(25, 118, 210, 0.1)",
          borderRadius: "24px",
        },
      },
      {
        id: "decorative-geometric",
        name: "Geometric",
        backgroundColor: "#FCE4EC",
        textColor: "#1A1A1A",
        buttonColor: "#E91E63",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%)",
          boxShadow: "0 8px 32px rgba(233, 30, 99, 0.1)",
          borderRadius: "24px",
        },
      },
    ],
  },
  Gradient: {
    name: "Gradient",
    themes: [
      {
        id: "gradient-rainbow",
        name: "Rainbow Mist",
        backgroundColor: "#E1F5FE",
        textColor: "#1A1A1A",
        buttonColor: "#673AB7",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 50%, #E1BEE7 100%)",
          boxShadow: "0 8px 32px rgba(103, 58, 183, 0.2)",
          borderRadius: "16px",
        },
      },
      {
        id: "gradient-northern-lights",
        name: "Northern Lights",
        backgroundColor: "#E0F7FA",
        textColor: "#1A1A1A",
        buttonColor: "#00BCD4",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 50%, #E0F2F1 100%)",
          boxShadow: "0 8px 32px rgba(0, 188, 212, 0.2)",
          borderRadius: "16px",
        },
      },
    ],
  },
  Glass: {
    name: "Glass",
    themes: [
      {
        id: "glass-frost",
        name: "Frosted Glass",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        buttonColor: "#03A9F4",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(3, 169, 244, 0.1)",
          borderRadius: "24px",
        },
      },
      {
        id: "glass-neon",
        name: "Neon Glass",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        buttonColor: "#FF4081",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 64, 129, 0.3)",
          boxShadow: "0 8px 32px rgba(255, 64, 129, 0.1)",
          borderRadius: "24px",
          animation: "glow 2s ease-in-out infinite alternate",
        },
      },
    ],
  },
  Creative: {
    name: "Creative",
    themes: [
      {
        id: "creative-illustration",
        name: "Illustration Delight",
        backgroundColor: "#F5F5DC",
        textColor: "#333333",
        buttonColor: "#FF5722",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          backgroundImage: "url('/assets/illustrations/background.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          borderRadius: "12px",
        },
      },
      {
        id: "creative-shapes",
        name: "Shapes Galore",
        backgroundColor: "#E0F7FA",
        textColor: "#004D40",
        buttonColor: "#00796B",
        buttonTextColor: "#FFFFFF",
        backgroundStyle: {
          backgroundImage: "url('/assets/shapes/pattern.svg')",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top right",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          borderRadius: "12px",
        },
      },
    ],
  },
};

// Add CSS animations to your global styles or component
export const themeStyles = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 10px rgba(255, 64, 129, 0.2),
                 0 0 20px rgba(255, 64, 129, 0.2),
                 0 0 30px rgba(255, 64, 129, 0.2);
    }
    to {
      box-shadow: 0 0 20px rgba(255, 64, 129, 0.4),
                 0 0 30px rgba(255, 64, 129, 0.4),
                 0 0 40px rgba(255, 64, 129, 0.4);
    }
  }

  .gradient-animation {
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }
`;
