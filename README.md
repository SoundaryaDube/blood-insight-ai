
### Project Description
link : https://blood-scan-wizard.lovable.app
**Blood Insight AI** is a modern health-tech application designed to simplify the analysis of medical blood reports. By leveraging advanced AI, it allows users to upload their blood test results in various formats and receive instant, easy-to-understand insights into their health status.

The system automatically extracts data from reports to identify potential health issues—such as iron deficiency or anemia—and provides personalized recommendations, making complex medical data accessible to everyone.

### Key Features

* **Multi-Format Support:** Users can upload reports in **PDF**, **CSV**, **PNG**, or **JPG/JPEG** formats.
* **AI-Powered Analysis:** Utilizes Google's **Gemini 1.5 Flash** model (via Lovable AI Gateway) to intelligently parse and analyze medical data.
* **Comprehensive Health Insights:** Automatically detects and flags specific issues including:
    * Iron Deficiency (Hemoglobin, Ferritin, Serum Iron)
    * Anemia Indicators
    * White Blood Cell (WBC) abnormalities
    * Platelet count deviations
    * Other significant variances from normal reference ranges.
* **Actionable Results:** Presents findings with clear severity indicators (High, Medium, Low, Normal), plain-English descriptions, and practical recommendations for next steps.
* **Secure Processing:** Built with privacy in mind, using secure edge functions for data processing.

### Tech Stack

* **Frontend:** React, TypeScript, Vite.
* **Styling:** Tailwind CSS, shadcn/ui components.
* **Backend:** Supabase Edge Functions (Deno).
* **AI Integration:** Lovable AI Gateway (LLM integration).
* **Infrastructure:** Supabase (Auth, Database, Functions).
