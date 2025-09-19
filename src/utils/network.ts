import { networkInterfaces } from 'os';

export function getLocalIPAddresses(): string[] {
  const interfaces = networkInterfaces();
  const addresses: string[] = [];

  for (const interfaceName in interfaces) {
    const interfaceData = interfaces[interfaceName];
    if (!interfaceData) continue;

    for (const alias of interfaceData) {
      // 跳过内部回环地址和 IPv6 地址
      if (alias.family === 'IPv4' && !alias.internal) {
        addresses.push(alias.address);
      }
    }
  }

  return addresses;
}

export function getPrimaryLocalIP(): string {
  const addresses = getLocalIPAddresses();

  // 优先返回 192.168.x.x 或 10.x.x.x 网段的地址
  const privateIP = addresses.find(ip =>
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.')
  );

  return privateIP || addresses[0] || 'localhost';
}

export function getServerUrls(host: string, port: number): string[] {
  const urls: string[] = [];

  if (host === '0.0.0.0' || host === '::') {
    // 监听所有接口时，显示所有可用的访问地址
    urls.push(`http://localhost:${port}`);

    const localIPs = getLocalIPAddresses();
    localIPs.forEach(ip => {
      urls.push(`http://${ip}:${port}`);
    });
  } else {
    urls.push(`http://${host}:${port}`);
  }

  return urls;
}