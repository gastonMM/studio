# **App Name**: 3D Print Cost Calc

## Core Features:

- Manage Materials: Enable users to manage materials (filaments) with details like name, cost per kg, weight, and URL for price updates. Default spool weight of 1000g should be set.
- Manage Accessories: Enable users to manage accessories like screws and glue with details including name, cost per unit, URL for price updates, and units per package. Default units per package should be set to 1.
- Automated Price Fetch: Experimental feature that uses an LLM tool with browsing capabilities to automatically fetch the current price of a material or accessory from a given URL, suggesting it to the user for confirmation before updating. The tool shall take an url as input, and extract pricing information from it, returning the found price.
- Configure Printer Profiles: Allow users to configure printer settings, including printer model, power consumption, electricity cost, acquisition cost, estimated lifespan, failure rate, and labor costs, defaulting to Creality Ender 3 Pro settings.
- Calculate Print Cost: Enable users to input project details such as material, printer settings, weight, print time, post-processing time, and accessories, then calculate the total cost, including material, electricity, amortization, labor, contingency for failures and the costs of the included accessories.

## Style Guidelines:

- Primary color: Use a clean, professional blue (#3498db) to convey trust and efficiency.
- Secondary color: Light grey (#ecf0f1) for backgrounds to ensure readability and a modern look.
- Accent: Green (#2ecc71) to highlight important actions like calculating costs, saving or updating information, indicating a positive action.
- Use a clean, sans-serif font for all text elements to maintain readability and a professional appearance.
- Incorporate minimalist icons to represent different materials, accessories, and settings for a user-friendly interface.
- Use a responsive, grid-based layout to ensure the application is accessible and easy to use on different devices.
- Subtle animations to indicate loading or processing states during calculations or data fetching to keep the user engaged.