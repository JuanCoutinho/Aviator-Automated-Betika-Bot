import React, { useState, useEffect, useRef } from 'react';

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;700;900&family=Space+Mono:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --gold-0: #FFFDE7;
    --gold-1: #FFE066;
    --gold-2: #F5C518;
    --gold-3: #B8860B;
    --bg-dark: #000000;
    --bg-card: rgba(15, 15, 15, 0.6);
    --green: #00E676;
    --font-display: 'Outfit', sans-serif;
    --font-body: 'Inter', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  html { scroll-behavior: smooth; overflow-x: hidden; }

  body {
    background: var(--bg-dark);
    color: #E0E0E0;
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overflow-x: hidden;
  }

  ::selection {
    background: rgba(245, 197, 24, 0.2);
    color: var(--gold-2);
  }

  /* ── PREMIUM UI/UX BACKGROUND & GLOWS ── */
  .bg-glow {
    position: fixed; top: -30%; left: -20%; width: 80vw; height: 80vw;
    background: radial-gradient(circle at center, rgba(245, 197, 24, 0.08) 0%, rgba(184, 134, 11, 0.03) 40%, transparent 70%);
    filter: blur(60px); pointer-events: none; z-index: -1;
  }
  .bg-glow-2 {
    position: fixed; bottom: -30%; right: -20%; width: 80vw; height: 80vw;
    background: radial-gradient(circle at center, rgba(245, 197, 24, 0.06) 0%, rgba(184, 134, 11, 0.02) 40%, transparent 70%);
    filter: blur(60px); pointer-events: none; z-index: -1;
  }
  .bg-glow-3 {
    position: fixed; top: 40%; left: 50%; width: 60vw; height: 60vw; transform: translate(-50%, -50%);
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.02) 0%, transparent 60%);
    filter: blur(80px); pointer-events: none; z-index: -1;
  }
  .bg-noise {
    position: fixed; inset: 0; pointer-events: none; z-index: -1; opacity: 0.035;
    background-image: url('data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E');
  }
  .bg-grid {
    position: fixed; inset: 0; pointer-events: none; z-index: -2;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
    opacity: 0.6;
  }

  /* ── MARQUEE TOP BAR ── */
  .marquee-bar {
    background: var(--gold-2);
    color: #000;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 8px 0;
    overflow: hidden;
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 2000;
    white-space: nowrap;
    border-bottom: 1px solid #fff;
  }
  .marquee-content {
    display: inline-block;
    padding-left: 100%;
    animation: marquee 20s linear infinite;
  }
  .marquee-text-chunk { margin-right: 50px; display: inline-flex; align-items: center; gap: 8px; }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }

  /* ── NAV ── */
  nav {
    position: fixed; top: 31px; left: 0; right: 0; z-index: 1000;
    padding: 24px 6%;
    display: flex; align-items: center; justify-content: space-between;
    background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
    backdrop-filter: blur(8px);
    mask-image: linear-gradient(to bottom, black 50%, transparent);
  }
  .nav-logo {
    font-family: var(--font-display);
    font-size: 24px; font-weight: 900;
    color: white;
    display: flex; align-items: center; gap: 10px;
    letter-spacing: 0.05em;
  }
  .nav-logo-icon {
    display: flex; align-items: center; justify-content: center;
    width: 48px; height: 48px;
    background: linear-gradient(135deg, var(--gold-0), var(--gold-2));
    color: #000; border-radius: 10px; font-size: 24px;
    box-shadow: 0 4px 15px rgba(245, 197, 24, 0.4);
    overflow: hidden;
  }
  .nav-btn {
    font-family: var(--font-display);
    font-size: 13px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 10px 24px; border-radius: 100px;
    background: rgba(255, 255, 255, 0.05);
    color: #fff; border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }
  .nav-btn:hover {
    background: var(--gold-2); color: #000;
    border-color: var(--gold-2);
    box-shadow: 0 0 20px rgba(245, 197, 24, 0.4);
  }

  /* ── PREMIUM BUTTONS ── */
  .btn-premium {
    position: relative;
    padding: 18px 48px;
    background: linear-gradient(180deg, var(--gold-1) 0%, var(--gold-2) 100%);
    color: #000;
    font-weight: 900;
    font-size: 17px;
    font-family: var(--font-display);
    border-radius: 16px;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 30px -10px rgba(245, 197, 24, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.4);
  }
  .btn-premium::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 50%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
    animation: buttonShine 3s infinite 2s;
  }
  @keyframes buttonShine { 0% { left: -100%; } 20% { left: 200%; } 100% { left: 200%; } }
  .btn-premium:hover {
    transform: translateY(-5px) scale(1.03);
    box-shadow: 0 24px 50px -10px rgba(245, 197, 24, 0.8), inset 0 2px 0 rgba(255, 255, 255, 0.4);
  }
  .btn-icon { width: 22px; height: 22px; transition: transform 0.3s; }
  .btn-premium:hover .btn-icon { transform: translateX(4px); }

  /* ── SHIMMER TEXT ── */
  .text-shimmer {
    background: linear-gradient(90deg, var(--gold-2) 0%, #fff 50%, var(--gold-2) 100%);
    background-size: 200% auto;
    color: #000;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer { to { background-position: 200% center; } }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 160px 6% 100px;
    position: relative;
  }
  .hero-container {
    display: grid; grid-template-columns: 1.1fr 1fr;
    gap: 60px; align-items: center;
    max-width: 1300px; margin: 0 auto; width: 100%;
  }
  @media (max-width: 1000px) {
    .hero-container { grid-template-columns: 1fr; text-align: center; }
    .hero-text { align-items: center; display: flex; flex-direction: column; }
    .hero { padding: 180px 6% 60px; }
  }

  .status-badge {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 8px 18px; border-radius: 100px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-family: var(--font-mono); font-size: 11px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #A0A0A0; margin-bottom: 30px;
  }
  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--green);
    box-shadow: 0 0 12px var(--green);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 230, 118, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(0, 230, 118, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 230, 118, 0); }
  }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(54px, 7.5vw, 98px);
    font-weight: 900; line-height: 0.95;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    color: #fff; margin-bottom: 24px;
    position: relative;
  }
  .hero-title .outline {
    color: transparent;
    -webkit-text-stroke: 1.5px rgba(255,255,255,0.2);
  }

  .hero-desc {
    font-size: 19px; line-height: 1.6;
    color: #888; font-weight: 300;
    max-width: 520px; margin-bottom: 48px;
  }
  .hero-desc strong { color: #fff; font-weight: 500; }

  .trust-indicators {
    display: flex; gap: 30px; margin-top: 40px;
    font-family: var(--font-mono); font-size: 11px; font-weight: 700;
    color: #666; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .trust-indicators span { display: flex; align-items: center; gap: 8px; }
  .trust-indicators i { color: var(--gold-2); font-size: 16px; font-style: normal; }

  /* ── PHONE VISUAL / COMPONENT ── */
  .visual-wrapper {
    position: relative; display: flex; justify-content: center; align-items: center;
    perspective: 1200px;
  }
  .phone-glow {
    position: absolute; width: 100%; height: 100%;
    background: var(--gold-2); filter: blur(120px); opacity: 0.2;
    border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);
  }
  .glass-phone {
    width: 330px; height: 680px;
    background: linear-gradient(145deg, rgba(30,30,30,0.8), rgba(10,10,10,0.95));
    backdrop-filter: blur(40px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 44px;
    box-shadow: 
      0 40px 100px rgba(0,0,0,0.9), 
      inset 0 1px 1px rgba(255,255,255,0.2), 
      inset 0 0 0 6px #050505;
    overflow: hidden; position: relative;
    display: flex; flex-direction: column;
    transform: rotateY(-8deg) rotateX(4deg);
    transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .visual-wrapper:hover .glass-phone {
    transform: rotateY(0deg) rotateX(0deg) translateY(-15px);
  }
  /* Screen Reflection */
  .glass-phone::after {
    content: ''; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.08) 50%, transparent 54%);
    z-index: 100;
  }
  
  .phone-notch {
    position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
    width: 100px; height: 28px; background: #000;
    border-radius: 14px; z-index: 10;
  }

  .phone-header {
    padding: 55px 24px 20px;
    background: linear-gradient(to bottom, rgba(245, 197, 24, 0.08), transparent);
    border-bottom: 1px solid rgba(255,255,255,0.03);
    display: flex; align-items: center; justify-content: space-between;
  }
  .phone-logo {
    font-family: var(--font-display); font-size: 18px; font-weight: 900;
    color: #fff; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px;
  }

  .phone-body {
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    position: relative; padding: 20px;
  }
  /* Radar Bg inside phone */
  .phone-body::before {
    content: ''; position: absolute; inset: 0; opacity: 0.03;
    background-image: radial-gradient(var(--gold-2) 1px, transparent 1px);
    background-size: 20px 20px; pointer-events: none;
  }

  /* Scan Radar Overlay */
  .scan-radar {
    width: 160px; height: 160px; border-radius: 50%;
    border: 1px dashed rgba(245, 197, 24, 0.4);
    position: relative; display: flex; align-items: center; justify-content: center;
  }
  .scan-radar::after {
    content: ''; position: absolute; inset: 0; border-radius: 50%;
    border: 1.5px solid var(--gold-2);
    animation: radarPing 2s infinite ease-out;
  }
  @keyframes radarPing {
    0% { transform: scale(0.6); opacity: 1; }
    100% { transform: scale(1.6); opacity: 0; }
  }
  .scan-text {
    font-family: var(--font-mono); font-size: 11px;
    color: var(--gold-2); letter-spacing: 0.2em; text-transform: uppercase;
    position: absolute; bottom: -50px; text-align: center;
    animation: blink 1.5s infinite;
  }

  /* Signal Components */
  .signal-box {
    text-align: center; animation: popIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 20; position: relative;
  }
  @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .signal-alert {
    display: inline-flex; align-items: center; justify-content: center; padding: 6px 16px; border-radius: 100px;
    background: rgba(0, 230, 118, 0.1); color: var(--green);
    border: 1px solid rgba(0, 230, 118, 0.2);
    font-family: var(--font-mono); font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; margin-bottom: 24px;
    box-shadow: 0 0 30px rgba(0, 230, 118, 0.15);
  }
  .signal-multiplier {
    font-family: var(--font-display); font-size: 76px; font-weight: 900;
    line-height: 1; color: #fff; letter-spacing: -0.02em;
    text-shadow: 0 0 40px rgba(255,255,255,0.4);
  }

  /* Plane Graph Simulation */
  .graph-curve {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 50%;
    overflow: hidden; pointer-events: none; opacity: 0.6;
  }

  .phone-footer {
    padding: 20px 24px; background: rgba(5,5,5,0.8);
    border-top: 1px solid rgba(255,255,255,0.03);
  }
  .history-row { display: flex; gap: 10px; justify-content: space-between; }
  .history-item {
    font-family: var(--font-mono); font-size: 11px; font-weight: 700;
    padding: 8px 0; flex: 1; text-align: center; border-radius: 6px;
    background: rgba(255,255,255,0.03); color: #777; border: 1px solid transparent;
  }
  .history-item.high { background: rgba(245, 197, 24, 0.08); color: var(--gold-2); border-color: rgba(245, 197, 24, 0.2); }

  /* ── FEATURES SECTION ── */
  .section { padding: 120px 6%; max-width: 1400px; margin: 0 auto; }
  .section-title {
    text-align: center; font-family: var(--font-display);
    font-size: clamp(36px, 5vw, 56px); font-weight: 900;
    text-transform: uppercase; margin-bottom: 80px; letter-spacing: -0.02em;
  }
  
  .features {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 40px;
  }
  .feature-card {
    background: linear-gradient(180deg, var(--bg-card) 0%, rgba(10,10,10,0.8) 100%);
    border: 1px solid rgba(255,255,255,0.03);
    padding: 50px 40px; border-radius: 24px;
    position: relative; overflow: hidden;
    transition: all 0.4s ease;
  }
  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
    background: linear-gradient(90deg, transparent, var(--gold-2), transparent);
    opacity: 0; transition: opacity 0.4s;
  }
  .feature-card:hover {
    transform: translateY(-8px);
    border-color: rgba(245, 197, 24, 0.2);
    box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 40px rgba(245, 197, 24, 0.05);
  }
  .feature-card:hover::before { opacity: 1; }
  
  .feat-icon {
    width: 70px; height: 70px; border-radius: 16px;
    background: linear-gradient(135deg, rgba(245, 197, 24, 0.15) 0%, transparent 100%);
    color: var(--gold-2); border: 1px solid rgba(245, 197, 24, 0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; margin-bottom: 30px; font-family: var(--font-display); font-weight: 900;
  }
  .feat-title {
    font-family: var(--font-display); font-size: 26px; font-weight: 800;
    color: #fff; margin-bottom: 16px; letter-spacing: -0.01em;
  }
  .feat-desc { font-size: 16px; color: #999; line-height: 1.7; font-weight: 300; }

  /* ── RESULTS GRID (PHONE UI MOCKUPS) ── */
  .prints-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
    max-width: 1200px; margin: 0 auto; padding: 0 20px;
  }
  @media (max-width: 900px) { .prints-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 600px; } }
  @media (max-width: 500px) { .prints-grid { grid-template-columns: 1fr; max-width: 340px; } }

  .print-wrapper { perspective: 1000px; }

  @keyframes floatPhone {
    0% { transform: translateY(0px) rotateX(0deg); }
    50% { transform: translateY(-12px) rotateX(2deg); }
    100% { transform: translateY(0px) rotateX(0deg); }
  }

  .print-item {
    position: relative; border-radius: 32px; padding: 10px;
    background: linear-gradient(135deg, #1c1c1c 0%, #050505 100%);
    box-shadow: 0 30px 60px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.2);
    transition: transform 0.3s ease;
    border: 1px solid rgba(255,255,255,0.08);
    animation: floatPhone 6s ease-in-out infinite;
  }
  .print-item::before {
    content: ''; position: absolute; top: 10px; left: 50%; transform: translateX(-50%);
    width: 40%; height: 20px; background: #050505;
    border-radius: 0 0 12px 12px; z-index: 5;
    box-shadow: inset 0 -1px 2px rgba(255,255,255,0.05);
  }
  .print-item::after {
    content: ''; position: absolute; top: 18px; left: 50%; transform: translateX(-50%);
    width: 15%; height: 4px; background: #000; border-radius: 10px; z-index: 6;
  }
  .print-item img {
    width: 100%; height: auto; display: block; border-radius: 24px;
    object-fit: cover; position: relative; z-index: 1;
    filter: brightness(0.95); transition: filter 0.5s;
  }
  .print-item:hover { transform: scale(1.03); animation-play-state: paused; z-index: 10; }
  .print-item:hover img { filter: brightness(1.05); }

  /* ── FAQ ── */
  .faq-item {
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
    border-radius: 16px; padding: 24px; margin-bottom: 16px;
    text-align: left; transition: all 0.3s;
    max-width: 800px; margin-left: auto; margin-right: auto;
  }
  .faq-item:hover { background: rgba(255,255,255,0.04); transform: translateX(5px); border-color: rgba(245, 197, 24, 0.3); }
  .faq-q { font-family: var(--font-display); font-size: 19px; font-weight: 800; color: #E9EDEF; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
  .faq-q i { color: var(--gold-2); }
  .faq-a { font-size: 16px; color: #999; line-height: 1.6; font-weight: 300; }

  /* ── WHATSAPP SCROLL BUTTON ── */
  .wa-float-btn {
    position: fixed; bottom: 25px; right: 25px; z-index: 9999;
    display: flex; align-items: flex-end; gap: 12px;
    text-decoration: none;
    animation: fade-up-wa 1s ease 2s backwards;
  }
  @keyframes fade-up-wa { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .wa-float-msg {
    background: #fff; color: #111; font-size: 13px; font-weight: 700;
    padding: 12px 14px; border-radius: 12px 12px 0 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.4);
    position: relative; max-width: 200px; white-space: normal; line-height: 1.4;
  }
  .wa-float-msg::after {
    content: ''; position: absolute; right: -6px; bottom: 0;
    width: 0; height: 0; border-left: 8px solid #fff; border-top: 8px solid transparent;
  }
  .wa-float-icon {
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, #25D366, #128C7E); color: #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 10px 30px rgba(37, 211, 102, 0.4);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); flex-shrink: 0;
    position: relative;
  }
  .wa-float-icon::before {
    content: ''; position: absolute; inset: -4px; border-radius: 50%;
    border: 2px solid rgba(37, 211, 102, 0.5);
    animation: wa-pulse 2s infinite; pointer-events: none;
  }
  @keyframes wa-pulse { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }
  .wa-float-icon svg { width: 30px; height: 30px; fill: currentColor; }
  .wa-float-btn:hover .wa-float-icon { transform: scale(1.05); }

  /* ── FOOTER ── */
  footer {
    background: #000; padding: 60px 6%;
    border-top: 1px solid rgba(255,255,255,0.05); text-align: center;
  }
  .footer-logo { font-family: var(--font-display); color: #fff; font-size: 28px; font-weight: 900; margin-bottom: 20px; letter-spacing: 0.1em; }
  .risk-badge {
    background: rgba(255, 61, 0, 0.1); border: 1px solid rgba(255, 61, 0, 0.2);
    color: var(--red); padding: 12px 24px; border-radius: 100px;
    font-size: 12px; font-weight: 600; font-family: var(--font-body); display: inline-block;
    margin-bottom: 30px; letter-spacing: 0.05em;
  }
  .footer-text { font-size: 13px; color: #555; font-family: var(--font-mono); }

  /* ── SCROLL ANIMATIONS ── */
  .fade-up {
    opacity: 0; transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .fade-up.visible { opacity: 1; transform: translateY(0); }
  
  .delay-0 { transition-delay: 0ms; }
  .delay-100 { transition-delay: 100ms; }
  .delay-200 { transition-delay: 200ms; }
  .delay-300 { transition-delay: 300ms; }
  .delay-400 { transition-delay: 400ms; }
`;

function App() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [status, setStatus] = useState('scanning'); // scanning, signal, flying
  const [history, setHistory] = useState([1.50, 4.25, 1.12, 10.40, 2.05]);

  useEffect(() => {
    let timeout, interval;
    if (status === 'scanning') {
      timeout = setTimeout(() => setStatus('signal'), 3500);
      setMultiplier(1.00);
    } else if (status === 'signal') {
      timeout = setTimeout(() => setStatus('flying'), 2500);
    } else if (status === 'flying') {
      interval = setInterval(() => {
        setMultiplier(prev => {
          const next = +(prev + 0.03).toFixed(2);
          if (next > 3.20) {
            setHistory(h => [parseFloat(next.toFixed(2)), ...h.slice(0, 4)]);
            setStatus('scanning');
            return 1.00;
          }
          return next;
        });
      }, 50);
    }
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [status]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const hiddenElements = document.querySelectorAll('.fade-up');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <div className="bg-glow"></div>
      <div className="bg-glow-2"></div>
      <div className="bg-glow-3"></div>
      <div className="bg-noise"></div>
      <div className="bg-grid"></div>

      <div className="marquee-bar">
        <div className="marquee-content">
          {[...Array(6)].map((_, i) => (
            <span className="marquee-text-chunk" key={i}>
              ⚠ VAGAS LIMITADAS <span style={{margin:'0 10px'}}>•</span> 98% DE ASSERTIVIDADE NAS ÚLTIMAS 24H <span style={{margin:'0 10px'}}>•</span> SINAIS VERIFICADOS <span style={{margin:'0 10px'}}>•</span>
            </span>
          ))}
        </div>
      </div>

      <nav>
        <div className="nav-logo">
          <div className="nav-logo-icon"><img src="./logo-sheik.png" alt="Sheik" style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>
          <div>SHEIK <span style={{fontWeight:300, color:'#A0A0A0'}}>VIP</span></div>
        </div>
        <a href="painel-vip.html" className="nav-btn" style={{textDecoration:'none'}}>Área VIP</a>
      </nav>

      <section className="hero">
        <div className="hero-container">
          <div className="hero-text">
            <div className="status-badge fade-up">
              <span className="status-dot"></span> Algoritmo em Operação
            </div>
            
            <h1 className="hero-title fade-up delay-100">
              MÉTODO SHEIK<br/>
              <span className="text-shimmer">BRASILEIRO</span><br/>
              <span className="outline">MILIONÁRIO.</span>
            </h1>
            
            <p className="hero-desc fade-up delay-200">
              Chega de adivinhar ou depender de intuição. Nosso sistema decodifica o gráfico em tempo real e entrega o <strong>sinal exato</strong> diretamente no seu celular.
            </p>
            
            <a href="painel-vip.html" className="btn-premium fade-up delay-300">
              Entrar Gratuitamente
              <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            
            <div className="trust-indicators fade-up delay-400">
              <span><i>★</i> Operação Simples</span>
              <span><i>★</i> Zero Experiência OBRIGATÓRIA</span>
            </div>
          </div>

          <div className="visual-wrapper fade-up delay-300">
            <div className="phone-glow"></div>
            <div className="glass-phone">
              <div className="phone-notch"></div>
              
              <div className="phone-header">
                <div className="phone-logo"><span style={{color:'var(--gold-2)'}}>⚜</span> SINAIS VIP</div>
                <div style={{display:'flex', alignItems:'center', gap:'6px', background:'rgba(0,230,118,0.1)', border:'1px solid rgba(0,230,118,0.2)', padding:'4px 8px', borderRadius:'100px', fontSize:'9px', color:'var(--green)', fontFamily:'var(--font-mono)', fontWeight:'700', textTransform:'uppercase'}}>
                  <div style={{width:'4px', height:'4px', borderRadius:'50%', background:'var(--green)', boxShadow:'0 0 5px var(--green)'}}></div>
                  Conectado
                </div>
              </div>

              <div className="phone-body">
                {status === 'scanning' && (
                  <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                    <div className="scan-radar">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold-2)" strokeWidth="1"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div className="scan-text">Mapeando Velas...</div>
                  </div>
                )}
                
                {status === 'signal' && (
                  <div className="signal-box">
                    <div className="signal-alert">⚠ JANELA DE OPORTUNIDADE</div>
                    <div className="signal-multiplier">1.50x</div>
                    <div style={{color:'#A0A0A0', fontSize:'11px', marginTop:'15px', textTransform:'uppercase', letterSpacing:'1px', fontFamily:'var(--font-mono)'}}>Meta de Retirada</div>
                  </div>
                )}

                {status === 'flying' && (
                  <div className="signal-box">
                    <div style={{color:'var(--gold-2)', fontSize:'11px', marginBottom:'15px', textTransform:'uppercase', letterSpacing:'2px', fontFamily:'var(--font-mono)', fontWeight:'700'}}>Ao Vivo</div>
                    <div className="signal-multiplier" style={{color: multiplier >= 2 ? 'var(--gold-1)' : '#fff', textShadow: multiplier >= 2 ? '0 0 50px rgba(245, 197, 24, 0.6)' : '0 0 30px rgba(255,255,255,0.2)'}}>
                      {multiplier.toFixed(2)}x
                    </div>
                  </div>
                )}
                
                {/* Airplane graphic simulation */}
                <div className="graph-curve">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{width:'100%', height:'100%'}}>
                    <path d="M-10,110 Q50,40 110,-10" fill="none" stroke="url(#graf)" strokeWidth="2" strokeDasharray="4 4" />
                    <defs>
                      <linearGradient id="graf" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--gold-3)" />
                        <stop offset="100%" stopColor="var(--gold-1)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {status === 'flying' && <div style={{position:'absolute', right:'20%', top:'20%', color:'#fff', transform:'rotate(45deg)', filter:'drop-shadow(0 0 10px #fff)', fontSize:'20px'}}>✈</div>}
                </div>
              </div>

              <div className="phone-footer">
                <div style={{fontSize:'10px', color:'#777', marginBottom:'10px', textTransform:'uppercase', letterSpacing:'1.5px', fontFamily:'var(--font-mono)', fontWeight:'700'}}>Últimas Extrações</div>
                <div className="history-row">
                  {history.map((h, i) => (
                    <div key={i} className={`history-item ${h >= 2 ? 'high' : ''}`}>{h.toFixed(2)}x</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="como-funciona">
        <h2 className="section-title fade-up">A Estrutura do <span className="text-shimmer">Lucro</span></h2>
        <div className="features">
          <div className="feature-card fade-up">
            <div className="feat-icon">1</div>
            <h3 className="feat-title">Acesso à Engenharia</h3>
            <p className="feat-desc">Após garantir sua vaga, você entra no canal VIP onde o nosso servidor mapeia cada decodificação de bloco 24 horas por dia.</p>
          </div>
          <div className="feature-card fade-up delay-100">
            <div className="feat-icon">2</div>
            <h3 className="feat-title">Alerta Notificado</h3>
            <p className="feat-desc">Assim que uma janela de 98% de chance se abre, o celular vibra com o sinal. Ele te diz em qual valor clicar para sair.</p>
          </div>
          <div className="feature-card fade-up delay-200">
            <div className="feat-icon">3</div>
            <h3 className="feat-title">Execução Fria</h3>
            <p className="feat-desc">Não tem chute. Você copia a indicação do sistema e confere o lucro caindo direto no seu saldo, rodada após rodada.</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(20,20,20,0.4) 50%, transparent 100%)' }}>
        <h2 className="section-title fade-up">Resultados dos <span style={{color:'var(--gold-2)'}}>Operadores</span></h2>
        <div className="prints-grid">
          {[
            '0ccde1ec-6706-4244-be36-33f1bdcb9f88.jpeg',
            '1518810b-8a1c-46df-ad8f-81ca39cf3752.jpeg',
            '26e7eed9-551a-4da3-8f5d-82f35f1dbf0c.jpeg',
            'eda0763e-cf0c-4358-8d14-a6ba27c042d3.jpeg'
          ].map((imgSrc, idx) => (
            <div key={idx} className={`print-wrapper fade-up delay-${(idx % 4) * 100}`}>
              <div className="print-item" style={{ animationDelay: `${idx * 0.8}s` }}>
                <img src={imgSrc} alt={`Resultado ${idx + 1}`} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <a href="painel-vip.html" className="btn-premium fade-up delay-100" style={{ fontSize: '15px', padding: '16px 36px' }}>Entrar na Sala de Sinais 🏆</a>
        </div>
      </section>

      <section className="section" id="faq" style={{ paddingBottom: '120px' }}>
        <h2 className="section-title fade-up">Perguntas <span className="text-shimmer">Frequentes</span></h2>
        
        <div className="faq-item fade-up">
          <div className="faq-q"><i>?</i> O acesso é realmente 100% Gratuito?</div>
          <div className="faq-a">Sim! Nossa sala VIP é e sempre será gratuita. Nós lucramos junto com a plataforma através do volume de operações diárias de nossa comunidade, então nunca precisaremos cobrar por assinatura ou taxas secretas de você.</div>
        </div>
        
        <div className="faq-item fade-up delay-100">
          <div className="faq-q"><i>?</i> Preciso saber sobre apostas ou gráficos?</div>
          <div className="faq-a">Nenhuma experiência anterior. O sistema do Sheik Brasileiro emite sinais claros que qualquer pessoa consegue replicar. Recebeu o alerta? Faça a entrada, tire no momento exato e coloque o lucro no bolso. Simples assim.</div>
        </div>

        <div className="faq-item fade-up delay-200">
          <div className="faq-q"><i>?</i> Como recebo os sinais de IA?</div>
          <div className="faq-a">Todos os sinais de algoritmo da nossa Inteligência Artificial chegam na palma da sua mão acessando nosso grupo VIP oficial após fazer seu cadastro gratuito, com as coordenadas mastigadas 24 horas por dia.</div>
        </div>
      </section>

      <footer>
        <div className="footer-logo">♛ SHEIK VIP</div>
        <div className="risk-badge">
          ⚠ AVISO LEGAL: O JOGO PODE CAUSAR DEPENDÊNCIA. APENAS 18+.
        </div>
        <p className="footer-text">Copyright © 2026 Método Sheik Brasileiro. Todos os direitos reservados. Os resultados podem variar de pessoa para pessoa.</p>
        <div style={{marginTop:'30px', display:'flex', justifyContent:'center', gap:'20px', fontFamily:'var(--font-body)', fontSize:'12px', color:'#555'}}>
          <a href="#" style={{color:'#555', textDecoration:'none'}}>Termos e Condições</a>
          <a href="#" style={{color:'#555', textDecoration:'none'}}>Políticas de Privacidade</a>
        </div>
      </footer>

      <a href="https://wa.me/5513996832181?text=Ol%C3%A1%21+Quero+replicar+a+estrutura+dessa+sala+de+sinais%21" target="_blank" className="wa-float-btn">
        <div className="wa-float-msg">Quer replicar essa estrutura de sala de sinais? 🚀</div>
        <div className="wa-float-icon">
          <svg viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937s-3.113 6.938-6.938 6.938z"/></svg>
        </div>
      </a>
    </>
  );
}
