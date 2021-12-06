-- Config Options
local modemChannel = 1
local transmitInterval = 1 -- Seconds
local proxyName = "peripheralProxy:"
local reactorName = "fissionReactorLogicAdapter"
local reactorAPName = "fissionReactor"
local boilerName = "boilerValve"
local boilerAPName = "boiler"
local turbineName = "turbineValve"
local turbineAPName = "turbine"
local inductionName = "inductionPort"
local inductionAPName = "inductionMatrix"

-- Find Wireless Modems
local wirelessModems = table.pack(peripheral.find("modem", function(_, modem)
  return modem.isWireless()
end))

-- Find the wired modems
local wiredModems = table.pack(peripheral.find("modem", function(_, modem)
  return not modem.isWireless()
end))

-- Find what is connected
local isSetup = false
local remoteNames = {}
local reactor = {}
local boilers = {}
local turbines = {}
local induction = {}

local function getListenerValues()
  remoteNames = wiredModems[1].getNamesRemote()
  local listenerData = {}

  for index, data in ipairs(remoteNames) do
    print(data)
  end

  if next(remoteNames) then
    if not isSetup then

      isSetup = true
      if string.find(remoteNames[1], reactorName .. "_%d") or string.find(remoteNames[1], proxyName .. reactorAPName .. "_%d") then
        print("Reactor Detected!")

        local object = peripheral.wrap(remoteNames[1])
        if object == nil then
          print("Failed to get reactor!")
          reactor = {}
          isSetup = false
        else
          reactor[1] = object
        end
      elseif string.find(remoteNames[1], boilerName .. "_%d") or string.find(remoteNames[1], proxyName .. boilerAPName .. "_%d") then
        print("Boiler Detected!")

        for k, v in pairs(remoteNames) do
          local object = peripheral.wrap(v)
          if object == nil then
            print("Failed to get Boiler!")
            boilers = {}
            isSetup = false
            break
          else
            boilers[k] = object
          end
        end
      elseif string.find(remoteNames[1], turbineName .. "_%d") or string.find(remoteNames[1], proxyName .. turbineAPName .. "_%d") then
        print("Turbine Detected!")

        for k, v in pairs(remoteNames) do
          local object = peripheral.wrap(v)
          if object == nil then
            print("Failed to get Turbine!")
            turbines = {}
            isSetup = false
            break
          else
            turbines[k] = object
          end
        end
      elseif string.find(remoteNames[1], inductionName .. "_%d") or string.find(remoteNames[1], proxyName .. inductionAPName .. "_%d") then
        print("Induction-Matrix Detected!")
        local object = peripheral.wrap(remoteNames[1])
        if object == nil then
          print("Failed to get Induction Matrix!")
          induction = {}
          isSetup = false
        else
          induction[1] = object
        end
      end
    end

    --[[
    Used to find properties if table is returned

    for k, v in pairs(reactor.getFuel()) do
      print(k, v)
    end
    --]]

    -- Get data from listener devices
    if  #reactor > 0 then
      listenerData["TYPE"] = "DATA"
      listenerData["TAG"] = "REACTOR"

      for k, v in pairs(reactor) do
        listenerData["DATA"] = {}

        local status, err = pcall(function()
          listenerData["DATA"]["coolant"] = v.getCoolant()
          listenerData["DATA"]["coolantCap"] = v.getCoolantCapacity()
          listenerData["DATA"]["coolantNeeded"] = v.getCoolantNeeded()
          listenerData["DATA"]["heated"] = v.getHeatedCoolant()
          listenerData["DATA"]["heatedCap"] = v.getHeatedCoolantCapacity()
          listenerData["DATA"]["heatedNeeded"] = v.getHeatedCoolantNeeded()
          listenerData["DATA"]["heatedFilledPercentage"] = v.getHeatedCoolantFilledPercentage()
          listenerData["DATA"]["fuel"] = v.getFuel()
          listenerData["DATA"]["fuelCap"] = v.getFuelCapacity()
          listenerData["DATA"]["fuelNeeded"] = v.getFuelNeeded()
          listenerData["DATA"]["fuelFilledPercentage"] = v.getFuelFilledPercentage()
          listenerData["DATA"]["waste"] = v.getWaste()
          listenerData["DATA"]["wasteCap"] = v.getWasteCapacity()
          listenerData["DATA"]["wasteNeeded"] = v.getWasteNeeded()
          listenerData["DATA"]["wasteFilledPercentage"] = v.getWasteFilledPercentage()
          listenerData["DATA"]["coolantFilledPercentage"] = v.getCoolantFilledPercentage()
          listenerData["DATA"]["burnRate"] = v.getBurnRate()
          listenerData["DATA"]["maxBurnRate"] = v.getMaxBurnRate()
          listenerData["DATA"]["actualBurnRate"] = v.getActualBurnRate()
          listenerData["DATA"]["damagePercent"] = v.getDamagePercent()
          listenerData["DATA"]["heatingRate"] = v.getHeatingRate()
          listenerData["DATA"]["environmentalLoss"] = v.getEnvironmentalLoss()
          listenerData["DATA"]["temperature"] = v.getTemperature()
          listenerData["DATA"]["heatCapacity"] = v.getHeatCapacity()
          listenerData["DATA"]["fuelAssemblies"] = v.getFuelAssemblies()
          listenerData["DATA"]["fuelSurfaceArea"] = v.getFuelSurfaceArea()
          listenerData["DATA"]["boilEfficiency"] = v.getBoilEfficiency()

          -- Set status string
          listenerData["DATA"]["status"] = "Inactive"
          if reactor[k].getStatus() then
            listenerData["DATA"]["status"] = "Active"
          end
        end)

        if not status then
          print("Failed when fetching data: " .. err)
          reactor = {}
          isSetup = false
          break
        end
      end
    elseif #boilers > 0 then
      listenerData["TYPE"] = "DATA"
      listenerData["TAG"] = "BOILER"
      for k, v in pairs(boilers) do
        listenerData["DATA"] = {}

        local status, err = pcall(function()
          listenerData["DATA"]["water"] = v.getWater()
          listenerData["DATA"]["waterCap"] = v.getWaterCapacity()
          listenerData["DATA"]["waterFilledPercentage"] = v.getWaterFilledPercentage()
          listenerData["DATA"]["heatedCoolant"] = v.getHeatedCoolant()
          listenerData["DATA"]["heatedCoolantCap"] = v.getHeatedCoolantCapacity()
          listenerData["DATA"]["heatedCoolantNeeded"] = v.getHeatedCoolantNeeded()
          listenerData["DATA"]["heatedCoolantFilledPercentage"] = v.getHeatedCoolantFilledPercentage()
          listenerData["DATA"]["steam"] = v.getSteam()
          listenerData["DATA"]["steamCap"] = v.getSteamCapacity()
          listenerData["DATA"]["steamFilledPercentage"] = v.getSteamFilledPercentage()
          listenerData["DATA"]["cooledCoolant"] = v.getCooledCoolant()
          listenerData["DATA"]["cooledCoolantCap"] = v.getCooledCoolantCapacity()
          listenerData["DATA"]["cooledCoolantNeeded"] = v.getCooledCoolantNeeded()
          listenerData["DATA"]["cooledCoolantFilledPercentage"] = v.getCooledCoolantFilledPercentage()
          listenerData["DATA"]["environmentalLoss"] = v.getEnvironmentalLoss()
          listenerData["DATA"]["temperature"] = v.getTemperature()
          listenerData["DATA"]["lastBoilRate"] = v.getBoilRate()
          listenerData["DATA"]["maxBoilRate"] = v.getMaxBoilRate()
          listenerData["DATA"]["superheaters"] = v.getSuperheaters()
          listenerData["DATA"]["boilCap"] = v.getBoilCapacity()

          -- Set status string
          listenerData["DATA"]["status"] = "Inactive"
          if listenerData["DATA"]["lastBoilRate"] > 1 then
            listenerData["DATA"]["status"] = "Active"
          end
        end)

        if not status then
          print("Failed when fetching data: " .. err)
          boilers = {}
          isSetup = false
          break
        end
      end
    elseif #turbines > 0 then
      listenerData["TYPE"] = "DATA"
      listenerData["TAG"] = "TURBINE"

      for k, v in pairs(turbines) do
        listenerData["DATA"] = {}
        local status, err = pcall(function()
          listenerData["DATA"]["steam"] = v.getSteam()
          listenerData["DATA"]["steamCap"] = v.getSteamCapacity()
          listenerData["DATA"]["steamNeeded"] = v.getSteamNeeded()
          listenerData["DATA"]["lastSteamInputRate"] = v.getLastSteamInputRate()
          listenerData["DATA"]["steamFilledPercentage"] = v.getSteamFilledPercentage()
          listenerData["DATA"]["dumpingMode"] = v.getDumpingMode()
          listenerData["DATA"]["productionRate"] = v.getProductionRate()
          listenerData["DATA"]["maxProduction"] = v.getMaxProduction()
          listenerData["DATA"]["flowRate"] = v.getFlowRate()
          listenerData["DATA"]["maxFlowRate"] = v.getMaxFlowRate()
          listenerData["DATA"]["maxWaterOutput"] = v.getMaxWaterOutput()
          listenerData["DATA"]["dispersers"] = v.getDispersers()
          listenerData["DATA"]["vents"] = v.getVents()
          listenerData["DATA"]["blades"] = v.getBlades()
          listenerData["DATA"]["coils"] = v.getCoils()
          listenerData["DATA"]["condensers"] = v.getCondensers()

          -- Set status string
          listenerData["DATA"]["status"] = "Inactive"
          if listenerData["DATA"]["productionRate"] > 1 then
            listenerData["DATA"]["status"] = "Active"
          end
        end)

        if not status then
          print("Failed when fetching data: " .. err)
          turbines = {}
          isSetup = false
          break
        end
      end
    elseif #induction > 0 then
      listenerData["TYPE"] = "DATA"
      listenerData["TAG"] = "INDUCTION"
      for k, v in pairs(induction) do
        listenerData["DATA"] = {}

        local status, err = pcall(function()
          listenerData["DATA"]["energy"] = v.getEnergy()
          listenerData["DATA"]["energyCap"] = v.getMaxEnergy()
          listenerData["DATA"]["energyNeeded"] = v.getEnergyNeeded()
          listenerData["DATA"]["energyFilledPercentage"] = v.getEnergyFilledPercentage()
          listenerData["DATA"]["transferCap"] = v.getTransferCap()
          listenerData["DATA"]["lastInput"] = v.getLastInput()
          listenerData["DATA"]["lastOutput"] = v.getLastOutput()
          listenerData["DATA"]["cells"] = v.getInstalledCells()
          listenerData["DATA"]["providers"] = v.getInstalledProviders()
          end)

        if not status then
          print("Failed when fetching data: " .. err)
          induction = {}
          isSetup = false
          break
        end
      end
    end
  end
  return listenerData
end

local function tick()
  while true do
    listenerData = getListenerValues()
	print("tick")

    if next(listenerData) then
      print("transmitting...")
      wirelessModems[1].transmit(modemChannel, modemChannel, listenerData)
    end
    sleep(transmitInterval)
  end
end



function main()
  wirelessModems[1].open(modemChannel)

  parallel.waitForAny(tick)
end

main()
