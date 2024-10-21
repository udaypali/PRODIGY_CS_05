let isCapturing = false;
let packets = [];
const trafficData = {
    labels: [],
    datasets: [{
        label: 'Packets/s',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
    }]
};

const ctx = document.getElementById('trafficChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: trafficData,
    options: {
        responsive: true,
        animation: false,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Time'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Packets/s'
                },
                beginAtZero: true
            }
        }
    }
});

function updateTrafficData(newPackets) {
    const now = new Date();
    trafficData.labels.push(now.toLocaleTimeString());
    trafficData.datasets[0].data.push(newPackets.length);

    if (trafficData.labels.length > 10) {
        trafficData.labels.shift();
        trafficData.datasets[0].data.shift();
    }

    chart.update();
}

function updateStatistics() {
    const totalPackets = packets.length;
    const avgSize = totalPackets > 0 ? packets.reduce((sum, p) => sum + p.size, 0) / totalPackets : 0;
    const packetsPerSecond = trafficData.datasets[0].data[trafficData.datasets[0].data.length - 1] || 0;

    document.getElementById('totalPackets').textContent = `Total Packets: ${totalPackets}`;
    document.getElementById('avgPacketSize').textContent = `Avg. Packet Size: ${avgSize.toFixed(2)} bytes`;
    document.getElementById('packetsPerSecond').textContent = `Packets/s: ${packetsPerSecond}`;
}

function updatePacketTable() {
    const filterValue = document.getElementById('packetFilter').value.toLowerCase();
    const protocolFilterValue = document.getElementById('protocolFilter').value;
    
    const tbody = document.querySelector('#packetTable tbody');
    tbody.innerHTML = '';
    
    const filteredPackets = packets.filter(packet => {
        const matchesFilter = packet.sourceIP.toLowerCase().includes(filterValue) ||
                              packet.destinationIP.toLowerCase().includes(filterValue) ||
                              packet.payload.toLowerCase().includes(filterValue);

        const matchesProtocol = protocolFilterValue === 'All' || packet.protocol === protocolFilterValue;

        return matchesFilter && matchesProtocol;
    });

    filteredPackets.slice(-100).forEach(packet => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${packet.timestamp}</td>
            <td>${packet.sourceIP}</td>
            <td>${packet.destinationIP}</td>
            <td>${packet.protocol}</td>
            <td>${packet.size} bytes</td>
        `;
        row.addEventListener('click', () => showPacketDetails(packet));
    });
}

function showPacketDetails(packet) {
    const detailsDiv = document.getElementById('packetDetails');
    detailsDiv.innerHTML = `
        <h3>Packet Details</h3>
        <p><strong>Timestamp:</strong> ${packet.timestamp}</p>
        <p><strong>Source IP:</strong> ${packet.sourceIP}</p>
        <p><strong>Destination IP:</strong> ${packet.destinationIP}</p>
        <p><strong>Protocol:</strong> ${packet.protocol}</p>
        <p><strong>Size:</strong> ${packet.size} bytes</p>
        <p><strong>Payload (Base64):</strong> ${packet.payload}</p>
    `;
}

document.getElementById('captureButton').addEventListener('click', () => {
    isCapturing = !isCapturing;
    const button = document.getElementById('captureButton');

    if (isCapturing) {
        button.textContent = 'Stop Capture';
        button.classList.remove('button-start');
        button.classList.add('button-stop');
        eel.start_capture('Wi-Fi');
    } else {
        button.textContent = 'Start Capture';
        button.classList.remove('button-stop');
        button.classList.add('button-start');
        eel.start_capture();
    }
});

document.getElementById('exportButton').addEventListener('click', async () => {
    const filePath = await eel.export_packets()();

    if (!filePath) {
        alert("Export canceled or no packet data available.");
    } else {
        alert("Packets exported successfully to: " + filePath);
    }
});

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const button = document.getElementById('themeToggle');
    const icon = button.querySelector('.theme-icon');
    const text = button.querySelector('.theme-text');
    
    if (document.body.classList.contains('dark-mode')) {
        icon.textContent = '🌙';
        text.textContent = 'Dark';
    } else {
        icon.textContent = '🌞';
        text.textContent = 'Light';
    }
});

document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('packetList').style.display = tab.dataset.tab === 'packetList' ? 'block' : 'none';
        document.getElementById('packetInspection').style.display = tab.dataset.tab === 'packetInspection' ? 'block' : 'none';
    });
});

eel.expose(add_packet);
function add_packet(packetData) {
    const packet = JSON.parse(packetData);
    packets.push(packet);
    updateTrafficData([packet]);
    updateStatistics();
    updatePacketTable();
}

document.getElementById('packetFilter').addEventListener('input', updatePacketTable);
document.getElementById('protocolFilter').addEventListener('change', updatePacketTable);
