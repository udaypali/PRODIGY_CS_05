import psutil
import platform
import subprocess
import eel
from scapy.all import sniff, Packet
import json
import threading
from datetime import datetime
import queue
import csv
from tkinter import Tk
from tkinter import filedialog

capture_thread = None
sniffing = False
packet_queue = queue.Queue()

def get_wifi_interface():
    os_type = platform.system()

    if os_type == 'Windows':
        for iface, addrs in psutil.net_if_addrs().items():
            if iface.startswith('Wi-Fi'):
                nic_info = psutil.net_if_stats()[iface]
                if nic_info.isup:
                    return iface

    elif os_type == 'Linux':
        try:
            result = subprocess.run(['iw', 'dev'], stdout=subprocess.PIPE, text=True)
            for line in result.stdout.splitlines():
                if 'Interface' in line:
                    iface = line.split()[-1]
                    return iface
        except FileNotFoundError:
            print("The 'iw' command is not found. Please install 'iw'.")

    elif os_type == 'Darwin':
        try:
            result = subprocess.run(['networksetup', '-listallhardwareports'], stdout=subprocess.PIPE, text=True)
            lines = result.stdout.splitlines()
            for i, line in enumerate(lines):
                if 'Wi-Fi' in line:
                    iface = lines[i+1].split()[-1]
                    return iface
        except FileNotFoundError:
            print("The 'networksetup' command is not available.")

    return None

protocol_map = {
    1: 'ICMP',
    6: 'TCP',
    17: 'UDP',
    50: 'ESP',
    51: 'AH',
    80: 'HTTP',
    443: 'HTTPS'
}

def process_packet(packet: Packet):
    formatted_time = datetime.fromtimestamp(packet.time).strftime('%Y-%m-%d %H:%M:%S.%f')
    protocol_number = packet[0].proto if hasattr(packet[0], 'proto') else None
    protocol_name = protocol_map.get(protocol_number, f"Unknown ({protocol_number})")

    packet_data = {
        'timestamp': formatted_time,
        'sourceIP': packet[0].src,
        'destinationIP': packet[0].dst,
        'protocol': protocol_name,
        'size': len(packet),
        'payload': packet[0].load.hex()[:20] if hasattr(packet[0], 'load') else ''
    }

    packet_queue.put(packet_data)

def packet_processor():
    while sniffing or not packet_queue.empty():
        try:
            packet_data = packet_queue.get(timeout=1)
            eel.add_packet(json.dumps(packet_data))
        except queue.Empty:
            continue

@eel.expose
def start_capture(dummy=None):
    global sniffing, capture_thread

    if not sniffing:
        sniffing = True
        wifi_interface = get_wifi_interface()

        if wifi_interface:
            print(f"Capturing packets on interface: {wifi_interface}")
            capture_thread = threading.Thread(target=sniff_packets, args=(wifi_interface,))
            capture_thread.start()

            processor_thread = threading.Thread(target=packet_processor)
            processor_thread.start()
        else:
            print("No Wi-Fi interface detected. Please check your network settings.")
    else:
        print("Stopping packet capture...")
        sniffing = False
        if capture_thread and capture_thread.is_alive():
            capture_thread.join()

def sniff_packets(interface):
    sniff(iface=interface, prn=process_packet, store=0, stop_filter=lambda p: not sniffing)
    print("Packet capture stopped.")

@eel.expose
def export_packets():
    packets = list(packet_queue.queue)
    
    if not packets:
        return None

    Tk().withdraw()
    file_path = filedialog.asksaveasfilename(defaultextension=".csv",
                                               filetypes=[("CSV files", "*.csv"), ("All files", "*.*")])
    
    if not file_path:
        return None

    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Timestamp", "Source IP", "Destination IP", "Protocol", "Size", "Payload"])
        for packet in packets:
            writer.writerow([packet['timestamp'], packet['sourceIP'], packet['destinationIP'], packet['protocol'], packet['size'], packet['payload']])
    
    return file_path

eel.init('gui')
eel.start('index.html')
