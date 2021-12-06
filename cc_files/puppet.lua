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
local inductionAPName = "inductionMatrix"  -- Needs to be updated later when AP does

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
      listenerData["type"] = "reactor"

      for k, v in pairs(reactor) do
        listenerData[k] = {}

        local status, err = pcall(function()
          listenerData[k]["coolant"] = v.getCoolant()
          listenerData[k]["coolantCap"] = v.getCoolantCapacity()
          listenerData[k]["coolantNeeded"] = v.getCoolantNeeded()
          listenerData[k]["heated"] = v.getHeatedCoolant()
          listenerData[k]["heatedCap"] = v.getHeatedCoolantCapacity()
          listenerData[k]["heatedNeeded"] = v.getHeatedCoolantNeeded()
          listenerData[k]["heatedFilledPercentage"] = v.getHeatedCoolantFilledPercentage()
          listenerData[k]["fuel"] = v.getFuel()
          listenerData[k]["fuelCap"] = v.getFuelCapacity()
          listenerData[k]["fuelNeeded"] = v.getFuelNeeded()
          listenerData[k]["fuelFilledPercentage"] = v.getFuelFilledPercentage()
          listenerData[k]["waste"] = v.getWaste()
          listenerData[k]["wasteCap"] = v.getWasteCapacity()
          listenerData[k]["wasteNeeded"] = v.getWasteNeeded()
          listenerData[k]["wasteFilledPercentage"] = v.getWasteFilledPercentage()
          listenerData[k]["coolantFilledPercentage"] = v.getCoolantFilledPercentage()
          listenerData[k]["burnRate"] = v.getBurnRate()
          listenerData[k]["maxBurnRate"] = v.getMaxBurnRate()
          listenerData[k]["actualBurnRate"] = v.getActualBurnRate()
          listenerData[k]["damagePercent"] = v.getDamagePercent()
          listenerData[k]["heatingRate"] = v.getHeatingRate()
          listenerData[k]["environmentalLoss"] = v.getEnvironmentalLoss()
          listenerData[k]["temperature"] = v.getTemperature()
          listenerData[k]["heatCapacity"] = v.getHeatCapacity()
          listenerData[k]["fuelAssemblies"] = v.getFuelAssemblies()
          listenerData[k]["fuelSurfaceArea"] = v.getFuelSurfaceArea()
          listenerData[k]["boilEfficiency"] = v.getBoilEfficiency()

          -- Set status string
          listenerData[k]["status"] = "Inactive"
          if reactor[k].getStatus() then
            listenerData[k]["status"] = "Active"
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
      listenerData["type"] = "boiler"
      for k, v in pairs(boilers) do
        listenerData[k] = {}

        local status, err = pcall(function()
          listenerData[k]["water"] = v.getWater()
          listenerData[k]["waterCap"] = v.getWaterCapacity()
          listenerData[k]["waterFilledPercentage"] = v.getWaterFilledPercentage()
          listenerData[k]["heatedCoolant"] = v.getHeatedCoolant()
          listenerData[k]["heatedCoolantCap"] = v.getHeatedCoolantCapacity()
          listenerData[k]["heatedCoolantNeeded"] = v.getHeatedCoolantNeeded()
          listenerData[k]["heatedCoolantFilledPercentage"] = v.getHeatedCoolantFilledPercentage()
          listenerData[k]["steam"] = v.getSteam()
          listenerData[k]["steamCap"] = v.getSteamCapacity()
          listenerData[k]["steamFilledPercentage"] = v.getSteamFilledPercentage()
          listenerData[k]["cooledCoolant"] = v.getCooledCoolant()
          listenerData[k]["cooledCoolantCap"] = v.getCooledCoolantCapacity()
          listenerData[k]["cooledCoolantNeeded"] = v.getCooledCoolantNeeded()
          listenerData[k]["cooledCoolantFilledPercentage"] = v.getCooledCoolantFilledPercentage()
          listenerData[k]["environmentalLoss"] = v.getEnvironmentalLoss()
          listenerData[k]["temperature"] = v.getTemperature()
          listenerData[k]["lastBoilRate"] = v.getBoilRate()
          listenerData[k]["maxBoilRate"] = v.getMaxBoilRate()
          listenerData[k]["superheaters"] = v.getSuperheaters()
          listenerData[k]["boilCap"] = v.getBoilCapacity()

          -- Set status string
          listenerData[k]["status"] = "Inactive"
          if listenerData[k]["lastBoilRate"] > 1 then
            listenerData[k]["status"] = "Active"
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
      listenerData["type"] = "turbine"
      for k, v in pairs(turbines) do
        listenerData[k] = {}
        local status, err = pcall(function()
          listenerData[k]["steam"] = v.getSteam()
          listenerData[k]["steamCap"] = v.getSteamCapacity()
          listenerData[k]["steamNeeded"] = v.getSteamNeeded()
          listenerData[k]["lastSteamInputRate"] = v.getLastSteamInputRate()
          listenerData[k]["steamFilledPercentage"] = v.getSteamFilledPercentage()
          listenerData[k]["dumpingMode"] = v.getDumpingMode()
          listenerData[k]["productionRate"] = v.getProductionRate()
          listenerData[k]["maxProduction"] = v.getMaxProduction()
          listenerData[k]["flowRate"] = v.getFlowRate()
          listenerData[k]["maxFlowRate"] = v.getMaxFlowRate()
          listenerData[k]["maxWaterOutput"] = v.getMaxWaterOutput()
          listenerData[k]["dispersers"] = v.getDispersers()
          listenerData[k]["vents"] = v.getVents()
          listenerData[k]["blades"] = v.getBlades()
          listenerData[k]["coils"] = v.getCoils()
          listenerData[k]["condensers"] = v.getCondensers()

          -- Set status string
          listenerData[k]["status"] = "Inactive"
          if listenerData[k]["productionRate"] > 1 then
            listenerData[k]["status"] = "Active"
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
      listenerData["type"] = "induction"
      for k, v in pairs(induction) do
        listenerData[k] = {}

        local status, err = pcall(function()
          listenerData[k]["energy"] = v.getEnergy()
          listenerData[k]["energyCap"] = v.getMaxEnergy()
          listenerData[k]["energyNeeded"] = v.getEnergyNeeded()
          listenerData[k]["energyFilledPercentage"] = v.getEnergyFilledPercentage()
          listenerData[k]["transferCap"] = v.getTransferCap()
          listenerData[k]["lastInput"] = v.getLastInput()
          listenerData[k]["lastOutput"] = v.getLastOutput()
          listenerData[k]["cells"] = v.getInstalledCells()
          listenerData[k]["providers"] = v.getInstalledProviders()
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
