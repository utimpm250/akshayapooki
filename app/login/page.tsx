"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSigningIn) return;

    setIsSigningIn(true);

    let isValid = false;
    let assignedRole = "staff";
    let displayName = "";

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    // Admin Login
    if (cleanUsername === "admin" && cleanPassword === "admin") {
      isValid = true;
      assignedRole = "admin";
      displayName = "Admin User";
    } else {
      // Staff Login
      const savedStaffData = localStorage.getItem("smart_akshaya_staff");

      if (savedStaffData) {
        try {
          const staffArray = JSON.parse(savedStaffData);

          if (Array.isArray(staffArray)) {
            const matchedStaff = staffArray.find((s: any) => {
              const sName = (
                s.name ||
                s.staffName ||
                s.username ||
                ""
              )
                .trim()
                .toLowerCase();

              const sPass = (s.password || s.pass || "").trim();

              const defaultPass =
                `${sName.split(" ")[0]}akshaya`.toLowerCase();

              const sEmail = (s.email || "").trim().toLowerCase();

              return (
                (sName === cleanUsername || sEmail === cleanUsername) &&
                (
                  (sPass !== "" && sPass === cleanPassword) ||
                  defaultPass === cleanPassword.toLowerCase() ||
                  cleanPassword === "akshaya123"
                )
              );
            });

            if (matchedStaff) {
              isValid = true;

              assignedRole =
                matchedStaff.role?.toLowerCase() === "admin"
                  ? "admin"
                  : "staff";

              displayName =
                matchedStaff.name ||
                matchedStaff.staffName ||
                matchedStaff.username;
            }
          }
        } catch (err) {
          console.error("Error reading staff storage", err);
        }
      }
    }

    if (isValid) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          username: displayName,
          role: assignedRole,
        })
      );

      localStorage.setItem(
        "loginSessionDate",
        new Date().toISOString().split("T")[0]
      );

      // ചെറിയ signing animation
      setTimeout(() => {
        router.push("/dashboard");
      }, 700);
    } else {
      setTimeout(() => {
        setIsSigningIn(false);
        alert("Invalid Username or Password. Please check your credentials.");
      }, 700);
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          font-family:
            "Segoe UI",
            Tahoma,
            Geneva,
            Verdana,
            sans-serif;
          background: #0b0f19;
        }

        .flow-login-page {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 15% 20%,
              rgba(0, 198, 255, 0.16),
              transparent 32%
            ),
            radial-gradient(
              circle at 85% 80%,
              rgba(124, 58, 237, 0.18),
              transparent 35%
            ),
            #0b0f19;
        }

        /* ------------------------------------------------
           LIQUID BACKGROUND
        ------------------------------------------------ */

        .liquid-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .liquid-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(2px);
          opacity: 0.75;
          mix-blend-mode: screen;
          pointer-events: none;
        }

        .liquid-orb-1 {
          width: 420px;
          height: 420px;
          left: -130px;
          top: -100px;
          background:
            radial-gradient(
              circle at 35% 35%,
              rgba(0, 198, 255, 0.85),
              rgba(0, 114, 255, 0.35) 42%,
              transparent 72%
            );
          animation: liquidFloatOne 10s ease-in-out infinite;
        }

        .liquid-orb-2 {
          width: 500px;
          height: 500px;
          right: -190px;
          bottom: -180px;
          background:
            radial-gradient(
              circle at 40% 40%,
              rgba(139, 92, 246, 0.8),
              rgba(236, 72, 153, 0.28) 45%,
              transparent 72%
            );
          animation: liquidFloatTwo 13s ease-in-out infinite;
        }

        .liquid-orb-3 {
          width: 300px;
          height: 300px;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          background:
            radial-gradient(
              circle,
              rgba(0, 198, 255, 0.28),
              rgba(59, 130, 246, 0.1) 48%,
              transparent 72%
            );
          animation: liquidFloatThree 8s ease-in-out infinite;
        }

        .liquid-orb-4 {
          width: 220px;
          height: 220px;
          right: 12%;
          top: 12%;
          background:
            radial-gradient(
              circle,
              rgba(255, 65, 108, 0.22),
              rgba(255, 75, 43, 0.06) 55%,
              transparent 75%
            );
          animation: liquidFloatFour 11s ease-in-out infinite;
        }

        @keyframes liquidFloatOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(80px, 55px, 0) scale(1.15);
          }
        }

        @keyframes liquidFloatTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-90px, -70px, 0) scale(1.12);
          }
        }

        @keyframes liquidFloatThree {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
          }

          50% {
            transform: translate(-42%, -56%) scale(1.3);
          }
        }

        @keyframes liquidFloatFour {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }

          50% {
            transform: translate(-45px, 55px) scale(1.2);
          }
        }

        /* ------------------------------------------------
           GLASS CARD
        ------------------------------------------------ */

.flow-container {
  position: relative;
  width: 100%;
  max-width: 560px;
  z-index: 5;
}

.logo-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 190px;
  height: 155px;
  margin-bottom: 10px;
}

.animated-logo {
  position: relative;
  width: auto;
  height: 135px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;

  filter:
    drop-shadow(0 18px 30px rgba(0, 114, 255, 0.35))
    drop-shadow(0 0 20px rgba(0, 198, 255, 0.2));

  animation: logoFloat 4s ease-in-out infinite;
  transition: transform 0.4s ease;
}

        .flow-card::before {
          content: "";
          position: absolute;
          top: -150px;
          left: 50%;
          width: 300px;
          height: 300px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(0, 198, 255, 0.13);
          filter: blur(70px);
          pointer-events: none;
        }

.flow-card::after {
  display: none;
}

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(35px) scale(0.96);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ------------------------------------------------
           LOGO
        ------------------------------------------------ */
.logo-area {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 34px;
}
.company-logo-area {
  position: relative;
  width: 180px;
  height: 150px;
  margin: 0 auto 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: companyLogoEntrance 1s
    cubic-bezier(0.2, 0.8, 0.2, 1)
    both;
}

.company-logo {
  position: relative;
  z-index: 2;

  width: 120px;
  height: 120px;

  object-fit: contain;
  border-radius: 14px;

  filter:
    drop-shadow(0 12px 20px rgba(0, 198, 255, 0.25))
    drop-shadow(0 0 18px rgba(0, 114, 255, 0.18));

  animation:
    companyLogoFloat 3.5s ease-in-out infinite,
    companyLogoPulse 3.5s ease-in-out infinite;

  transform-origin: center center;
}

.company-logo:hover {
  transform: scale(1.05);

  filter:
    drop-shadow(0 18px 30px rgba(0, 198, 255, 0.4))
    drop-shadow(0 0 28px rgba(0, 114, 255, 0.3));
}

.company-logo-area {
  position: relative;
  width: 150px;
  height: 125px;
  margin: 0 auto 8px;

  display: flex;
  align-items: center;
  justify-content: center;

  animation: companyLogoEntrance 1s
    cubic-bezier(0.2, 0.8, 0.2, 1)
    both;
}

.company-logo-glow {
  position: absolute;

  width: 180px;
  height: 150px;

  border-radius: 50%;

  background:
    radial-gradient(
      ellipse,
      rgba(255, 255, 255, 0.28),
      rgb(249, 251, 253) 45%,
      transparent 100%
    );

  filter: blur(22px);

  animation: companyLogoGlow 3.5s ease-in-out infinite;
}

@keyframes companyLogoEntrance {
  0% {
    opacity: 0;
    transform: translateY(-25px) scale(0.85);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes companyLogoFloat {
  0% {
    transform: translateY(0) scale(1) rotate(0deg);
  }

  25% {
    transform: translateY(-5px) scale(1.02) rotate(-1deg);
  }

  50% {
    transform: translateY(-10px) scale(1.05) rotate(0deg);
  }

  75% {
    transform: translateY(-5px) scale(1.02) rotate(1deg);
  }

  100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

@keyframes companyLogoPulse {
  0%,
  100% {
    filter:
      drop-shadow(0 10px 18px rgba(0, 198, 255, 0.20))
      drop-shadow(0 0 12px rgba(0, 114, 255, 0.12));
  }

  50% {
    filter:
      drop-shadow(0 16px 28px rgba(0, 198, 255, 0.45))
      drop-shadow(0 0 28px rgba(0, 114, 255, 0.35));
  }
}
        .logo-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 150px;
          height: 125px;
          margin-bottom: 8px;
        }

        .logo-glow {
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(0, 198, 255, 0.42),
              rgba(0, 114, 255, 0.16) 40%,
              transparent 72%
            );
          filter: blur(20px);
          animation: logoGlow 4s ease-in-out infinite;
        }

        .animated-logo {
          position: relative;
          width: auto;
          height: 110px;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
          filter:
            drop-shadow(0 18px 30px rgba(0, 114, 255, 0.35))
            drop-shadow(0 0 20px rgba(0, 198, 255, 0.2));
          animation: logoFloat 4s ease-in-out infinite;
          transition: transform 0.4s ease;
        }

        .animated-logo:hover {
          transform: scale(1.06);
        }

        @keyframes logoGlow {
          0%,
          100% {
            transform: scale(0.9);
            opacity: 0.65;
          }

          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        @keyframes logoFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

.flow-title {
  margin: 0;
  font-size: 36px;
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.6px;

  background:
    linear-gradient(
      135deg,
      #ffffff 0%,
      #b9efff 45%,
      #8ab4ff 75%,
      #ffffff 100%
    );

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.flow-subtitle {
  margin: 10px 0 0;
  color: rgba(226, 232, 240, 0.75);
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
}

        /* ------------------------------------------------
           FORM
        ------------------------------------------------ */

.flow-form {
  position: relative;
  z-index: 3;
  animation: formEntrance 1s ease 0.2s both;
}

        @keyframes formEntrance {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

 .input-group {
  position: relative;
  margin-bottom: 18px;
}

.input-group input {
  width: 100%;
  height: 62px;
  padding: 0 20px;

  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 15px;

  color: #ffffff;
  font-size: 16px;
  font-weight: 500;

  outline: none;

  transition:
    border-color 0.3s ease,
    background 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.input-group input::placeholder {
  color: rgba(203, 213, 225, 0.58);
}

        .input-group input:hover {
          background: rgba(255, 255, 255, 0.085);
          border-color: rgba(255, 255, 255, 0.18);
        }

        .input-group input:focus {
          background: rgba(255, 255, 255, 0.11);
          border-color: rgba(0, 198, 255, 0.65);

          box-shadow:
            0 0 0 4px rgba(0, 198, 255, 0.08),
            0 0 25px rgba(0, 114, 255, 0.15);

          transform: translateY(-1px);
        }

        .options {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 5px 2px 22px;
          font-size: 12px;
          color: rgba(203, 213, 225, 0.65);
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
          user-select: none;
        }

        .remember-label input {
          accent-color: #00a9ff;
          cursor: pointer;
        }

        .forgot-link {
          color: rgba(186, 230, 253, 0.8);
          text-decoration: none;
          transition:
            color 0.25s ease,
            text-shadow 0.25s ease;
        }

        .forgot-link:hover {
          color: #ffffff;
          text-shadow: 0 0 12px rgba(0, 198, 255, 0.5);
        }

        /* ------------------------------------------------
           SIGN IN BUTTON
        ------------------------------------------------ */

.sign-in-btn {
  position: relative;
  overflow: hidden;

  width: 100%;
  height: 62px;

  border: none;
  border-radius: 15px;

  background:
    linear-gradient(
      135deg,
      #00c6ff 0%,
      #0072ff 45%,
      #6d28d9 100%
    );

  color: #ffffff;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.3px;

  cursor: pointer;

  box-shadow:
    0 12px 32px rgba(0, 114, 255, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);

  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    opacity 0.25s ease;
}

        .sign-in-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 80%;
          height: 100%;

          background:
            linear-gradient(
              100deg,
              transparent,
              rgba(255, 255, 255, 0.32),
              transparent
            );

          transform: skewX(-20deg);
          transition: left 0.6s ease;
        }

        .sign-in-btn:hover::before {
          left: 140%;
        }

        .sign-in-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 16px 38px rgba(0, 114, 255, 0.38),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
        }

        .sign-in-btn:active {
          transform: scale(0.98);
        }

        .sign-in-btn:disabled {
          cursor: wait;
          opacity: 0.75;
          transform: none;
        }

        .button-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ------------------------------------------------
           DIVIDER
        ------------------------------------------------ */

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
          color: rgba(148, 163, 184, 0.55);
          font-size: 11px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
        }

        /* ------------------------------------------------
           SOCIAL BUTTONS
        ------------------------------------------------ */

        .social-login {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .social-btn {
          flex: 1;
          height: 46px;
          border-radius: 12px;

          background: rgba(255, 255, 255, 0.055);
          border: 1px solid rgba(255, 255, 255, 0.1);

          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          font-weight: 600;

          cursor: pointer;

          transition:
            background 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .social-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
        }

        /* ------------------------------------------------
           FOOTER
        ------------------------------------------------ */

        .footer-text {
          margin: 0;
          text-align: center;
          font-size: 11px;
          line-height: 1.7;
          color: rgba(148, 163, 184, 0.55);
        }

        .footer-text strong {
          color: rgba(186, 230, 253, 0.75);
          font-weight: 600;
        }

        .footer-small {
          margin-top: 3px;
          font-size: 10px;
          color: rgba(148, 163, 184, 0.4);
        }

        /* ------------------------------------------------
           RESPONSIVE
        ------------------------------------------------ */

@media (max-width: 600px) {
.company-logo-area {
  width: 150px;
  height: 125px;
}  
.flow-login-page {
    padding: 16px;
  }

  .flow-container {
    max-width: 100%;
  }

  .flow-card {
    padding: 38px 22px 30px;
    border-radius: 26px;
  }

  .logo-wrapper {
    width: 150px;
    height: 125px;
  }

  .animated-logo {
    height: 105px;
  }

  .flow-title {
    font-size: 30px;
  }

  .flow-subtitle {
    font-size: 14px;
  }

  .input-group input {
    height: 56px;
    font-size: 15px;
  }

  .sign-in-btn {
    height: 56px;
    font-size: 16px;
  }
}

        @media (prefers-reduced-motion: reduce) {
          .liquid-orb,
          .flow-card,
          .flow-form,
          .logo-glow,
          .animated-logo {
            animation: none !important;
          }

          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <main className="flow-login-page">
        {/* Liquid background */}
        <div className="liquid-bg">
          <div className="liquid-orb liquid-orb-1" />
          <div className="liquid-orb liquid-orb-2" />
          <div className="liquid-orb liquid-orb-3" />
          <div className="liquid-orb liquid-orb-4" />
        </div>

        {/* Login */}
        <div className="flow-container">
          <section className="flow-card">
            {/* Logo */}
            <div className="logo-area">

<div className="company-logo-area">
  <div className="company-logo-glow" />

  <img
    src="/logo.png"
    alt="Company Logo"
    className="company-logo"
  />
</div>
              <h1 className="flow-title">Welcome Back</h1>

              <p className="flow-subtitle">
                Sign in to your Akshaya Pookiparamba Account
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="flow-form"
            >
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Staff Name / Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  disabled={isSigningIn}
                />
              </div>

              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={isSigningIn}
                />
              </div>
              <button
                type="submit"
                className="sign-in-btn"
                disabled={isSigningIn}
              >
                <span className="button-content">
                  {isSigningIn ? (
                    <>
                      <span className="spinner" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </span>
              </button>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}