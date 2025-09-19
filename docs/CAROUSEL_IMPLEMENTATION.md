# Carousel Background Images Implementation

## Overview
Enhanced the landing page carousel with background images and improved styling for better visual impact.

## Changes Made

### 1. NewsCard Component (`components/NewsCard.tsx`)
- Added dynamic background gradients as fallbacks when no cover image is available
- Enhanced background image styling with:
  - Subtle hover scale effect (`hover:scale-105`)
  - Better gradient overlays for text readability
  - Improved image sizing and quality parameters
- Added carousel-specific overlay class for enhanced visual appeal

### 2. Carousel Styles (`styles/carousel.css`)
- Enhanced slide styling with before pseudo-element for subtle visual effects
- Added parallax hover effect for background images
- Improved animation transitions with better easing functions
- Enhanced carousel dot styling with backdrop blur
- Added specialized background overlay class
- Ensured full-screen responsiveness for featured carousel

### 3. FeaturedPosts Component (`components/FeaturedPosts.tsx`)
- Added proper Embla CSS classes (`embla`, `embla__container`, `embla__slide`)
- Improved carousel container structure
- Enhanced content overlay for better text readability

### 4. Mock Data (`lib/mock-data.ts`)
- Updated featured posts with high-quality technology-themed background images
- Improved image URLs with higher resolution and better crop parameters
- Used development and technology-focused images from Unsplash

## Features
- **Dynamic Fallbacks**: Colorful gradient backgrounds when cover images aren't available
- **High-Quality Images**: Updated mock data with technology-themed backgrounds
- **Enhanced Visual Effects**: Subtle hover animations and overlay effects
- **Better Text Readability**: Multiple gradient overlays ensure text is always readable
- **Responsive Design**: Maintains full-screen experience across all device sizes
- **Smooth Animations**: Enhanced transitions and easing functions

## Image Sources
The implementation uses high-quality Unsplash images focused on:
- Software development and coding
- CSS and web design
- DevOps and containerization
- Technology and programming themes

## Technical Details
- Background images are loaded with `priority` flag for faster LCP
- Images use Next.js `Image` component for optimization
- Fallback gradients ensure visual consistency even without images
- CSS-based overlays provide better performance than additional DOM elements
- Responsive image sizing with proper `sizes` attribute