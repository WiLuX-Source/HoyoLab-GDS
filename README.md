<h1 align="center">
    HoyoLab GDS
</h1>

<p align="center">
    <img src="https://img.shields.io/github/license/WiLuX-Source/HoyoLab-GDS?style=flat-square" alt="">
    <img src="https://img.shields.io/github/stars/WiLuX-Source/HoyoLab-GDS?style=flat-square" alt="">
</p

Independent fork of [canaria3406/hoyolab-auto-sign](https://github.com/canaria3406/hoyolab-auto-sign)

> [!IMPORTANT]
> There is always a risk when using automation software.
> No one is responsible if anything happens to your account.

## Features

* **Auto Check In** - Get daily rewards in hoyo games.
* **Update Notifications** - Get notified when there is a new release.
* **Code Redeem(WIP)** - Redeem codes without you knowing it.

## Setup

1. Go to [Google Apps Script](https://script.google.com/home/start) and create a new project with your custom name.
2. Select the editor and paste the content inside main.gs
3. Select "main" and click the "Run" button at the top.
   Grant the necessary permissions and confirm that the configuration is correct (Execution started > completed).
4. Click the trigger button on the left side and add a new trigger.
   Select the function to run: main
   Select the event source: Time-driven
   Select the type of time based trigger: Day timer
   Select the time of day: recommended to choose any off-peak time between 0900 to 1500.

## Inspirations and Special Thanks

* [**canaria3406/hoyolab-auto-sign**](https://github.com/canaria3406/hoyolab-auto-sign)

* [**rairulyle/hoyolab-auto-sign**](https://github.com/rairulyle/hoyolab-auto-sign)
