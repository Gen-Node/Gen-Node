# Run a node

Anyone can run a Gennode node — as easy as installing Ollama.

## Requirements
- A computer running macOS, Windows or Linux
- A crypto wallet (your node identity)
- A stable internet connection
- A GPU (NVIDIA / AMD / Apple Silicon) is **recommended** but not required

## Install

### Headless / CLI (available now)
The fastest way to run a node today is the command-line client — it registers your node and starts earning:
```bash
npx @gennode/node
```
This works on servers and headless machines without a GUI.

### Desktop app (early access)
Cross-platform desktop apps (macOS / Windows / Linux) are on **[GitHub Releases](https://github.com/Gen-Node/Gen-Node/releases)**:
1. Download the latest release for your platform.
2. Install and open the app.
3. **Connect your wallet.**
4. Click **Start node**.

The app runs in your tray, shows your live **points & uptime**, and earns while your machine is idle.

::: warning Windows SmartScreen ("Windows protected your PC")
During early access the installer is **not code-signed yet**, so Windows SmartScreen may warn you. The app is safe — it's open source ([apps/desktop](https://github.com/Gen-Node/Gen-Node/tree/main/apps/desktop)). To install: click **More info → Run anyway**. (macOS: right-click the app → **Open**.) Signed installers are coming.
:::

## How you earn
Points = `uptime × capacity`. Points convert to **`$GENNODE`** in the airdrop. Higher capacity and higher uptime earn more. Real compute jobs will earn additional points as the network matures.

## Fairness (anti-sybil)
Today, fairness comes from **wallet linking** and a **CPU benchmark** that proves your node runs on real hardware. Device fingerprinting, deduplication and cluster analysis are **planned** to further protect rewards for genuine operators.

> The desktop app and token are in active development.
