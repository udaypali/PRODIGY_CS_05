# Advanced Network Analyzer

This is an **Advanced Network Analyzer** built using Python and Eel, which captures and analyzes network traffic in real-time. The application allows users to monitor network packets, view statistics, and export captured data to CSV files.

## Features

- Real-time packet capture from Wi-Fi interfaces
- Visualization of network traffic using interactive charts
- Display of packet statistics: Total Packets, Average Packet Size, and Packets per Second
- Filtering and detailed inspection of captured packets
- Export of captured packets to CSV files for further analysis

## Requirements

- Python 3.11 or higher
- Required Python packages:
    - [eel](https://github.com/samuelhwilliams/Eel)
    - [scapy](https://scapy.readthedocs.io/en/latest/)
    - [psutil](https://psutil.readthedocs.io/en/latest/)

## Installation

### Setting Up a Virtual Environment

Creating a virtual environment is recommended to manage dependencies and avoid conflicts with other projects.

#### Windows

1. **Open Command Prompt** or PowerShell.

2. Navigate to your desired project directory:
```bash
cd path\\to\\your\\project
```

3. Create a new virtual environment:
```bash 
python -m venv venv
 ```

4. Activate the virtual environment:
```bash
venv\script\activate
```

#### Linux

1. **Open Terminal**

2. Navigate to your desired project directory:
```bash
git clone https://github.com/udaypali/PRODIGY_CS_05.git
cd PRODIGY_CS_05
```

3. Create a new virtual environment:
```bash 
python -m venv venv
 ```

4. Activate the virtual environment:
```bash
source venv/script/activate
```

## Install Required Packages

1. Make sure your virtual environment is activated (you should see (venv) in your terminal prompt).
 
2. Install the required packages:
```bash
pip install -r requirements.txt
```

## Usage

1. Start the application:
```bash
python3 main.py
```

2. Use the "Start Capture" button to begin monitoring network traffic.

3. Utilize filters to search through captured packets and click on any packet for detailed inspection.

4. I don't know why Export button is not working so... Export button doesn't work (Will fix it soon).

## Important Notes

- **Permissions**: Running this application may require administrative privileges, especially for capturing packets on some operating systems.

- **Network Interfaces**: Ensure you have a working Wi-Fi connection and the necessary permissions to access network interfaces.

## Acknowledgements

- **Eel** for creating the GUI interface.
- **Scapy** for packet capturing and manipulation.
- **Psutil** for system and network interface information.

## Disclaimer

This software is intended for educational and research purposes only. It is designed to demonstrate network packet capture and analysis techniques. Users are responsible for complying with local laws and regulations regarding network monitoring and data privacy. 

Unauthorized interception of network traffic may be illegal and unethical. By using this software, you agree that you will not use it for malicious purposes or to violate the privacy of others. The developer of this software is not liable for any misuse or unintended consequences arising from its use.

Please ensure that you have permission to monitor any network traffic you capture with this application.

## License

This project is for educational purposes only. Use responsibly and ethically.

## Contact

If you have any questions or feedback, feel free to reach out at [udaypali134@gmail.com].