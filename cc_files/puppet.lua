-- Config Options
local modemChannel = 1
local transmitInterval = 0 -- Seconds
local reactorName = "fissionReactorLogicAdapter"
local boilerName = "boilerValve"
local turbineName = "turbineValve"
local inductionName = "inductionPort"

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

-- Comapre values and send/update durent value if it's different
local function checkValue(objectTable, tag, name, lastValue, newValue)
  if lastValue == nil then
    objectTable['lastData'][name] = newValue
    --print(name)   -- Used to show what field is causing nil problems
    print("Updating Value")
  elseif lastValue ~= newValue then
    wirelessModems[1].transmit(modemChannel, modemChannel, {
      ['TYPE'] = 'DATA',
      ['TAG'] = tag,
      ['DATA'] = {[name] = newValue}
    })

    objectTable['lastData'][name] = newValue
    print("Updating & Sending Value")
  end
end

local function getListenerValues()
  remoteNames = wiredModems[1].getNamesRemote()
  local listenerData = {}

  if next(remoteNames) then
    if not isSetup then
      isSetup = true

      for index, data in ipairs(remoteNames) do
        print("Name of Connected Machines: " .. data)
      end

      if string.find(remoteNames[1], reactorName .. "_%d") then
        print("Reactor Detected!")

        local object = peripheral.wrap(remoteNames[1])
        if object == nil then
          print("Failed to get reactor!")
          reactor = {}
          isSetup = false
        else
          reactor[1] = {['object'] = object, ['lastData'] = {}}  -- Save object and a lastData to compare later
        end
      elseif string.find(remoteNames[1], boilerName .. "_%d") then
        print("Boiler Detected!")

        for k, v in pairs(remoteNames) do
          local object = peripheral.wrap(v)
          if object == nil then
            print("Failed to get Boiler!")
            boilers = {}
            isSetup = false
            break
          else
            boilers[k] = {['object'] = object, ['lastData'] = {}}
          end
        end
      elseif string.find(remoteNames[1], turbineName .. "_%d") then
        print("Turbine Detected!")

        for k, v in pairs(remoteNames) do
          local object = peripheral.wrap(v)
          if object == nil then
            print("Failed to get Turbine!")
            turbines = {}
            isSetup = false
            break
          else
            turbines[k] = {['object'] = object, ['lastData'] = {}}
          end
        end
      elseif string.find(remoteNames[1], inductionName .. "_%d") then
        print("Induction-Matrix Detected!")
        local object = peripheral.wrap(remoteNames[1])
        if object == nil then
          print("Failed to get Induction Matrix!")
          induction = {}
          isSetup = false
        else
          induction[1] = {['object'] = object, ['lastData'] = {}}
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
      for k, v in pairs(reactor) do
        local status, err = pcall(function()
          checkValue(v, 'REACTOR', 'temperature', v['lastData']['temperature'], v['object'].getTemperature())
          checkValue(v, 'REACTOR', 'coolantFilledPercentage', v['lastData']['coolantFilledPercentage'], v['object'].getCoolantFilledPercentage())
          checkValue(v, 'REACTOR', 'heatedFilledPercentage', v['lastData']['heatedFilledPercentage'], v['object'].getHeatedCoolantFilledPercentage())
          checkValue(v, 'REACTOR', 'coolantName', v['lastData']['coolantName'], v['object'].getCoolant()['name'])
          checkValue(v, 'REACTOR', 'coolantAmount', v['lastData']['coolantAmount'], v['object'].getCoolant()['amount'])
          checkValue(v, 'REACTOR', 'coolantCap', v['lastData']['coolantCap'], v['object'].getCoolantCapacity())
          checkValue(v, 'REACTOR', 'coolantNeeded', v['lastData']['coolantNeeded'], v['object'].getCoolantNeeded())
          checkValue(v, 'REACTOR', 'heatedName', v['lastData']['heatedName'], v['object'].getHeatedCoolant()['name'])
          checkValue(v, 'REACTOR', 'heatedAmount', v['lastData']['heatedAmount'], v['object'].getHeatedCoolant()['amount'])
          checkValue(v, 'REACTOR', 'heatedCap', v['lastData']['heatedCap'], v['object'].getHeatedCoolantCapacity())
          checkValue(v, 'REACTOR', 'heatedNeeded', v['lastData']['heatedNeeded'], v['object'].getHeatedCoolantNeeded())
          checkValue(v, 'REACTOR', 'fuel', v['lastData']['fuel'], v['object'].getFuel()['amount'])
          checkValue(v, 'REACTOR', 'fuelCap', v['lastData']['fuelCap'], v['object'].getFuelCapacity())
          checkValue(v, 'REACTOR', 'fuelNeeded', v['lastData']['fuelNeeded'], v['object'].getFuelNeeded())
          checkValue(v, 'REACTOR', 'fuelFilledPercentage', v['lastData']['fuelFilledPercentage'], v['object'].getFuelFilledPercentage())
          checkValue(v, 'REACTOR', 'temperature', v['lastData']['temperature'], v['object'].getTemperature())
          checkValue(v, 'REACTOR', 'coolantFilledPercentage', v['lastData']['coolantFilledPercentage'], v['object'].getCoolantFilledPercentage())
          checkValue(v, 'REACTOR', 'heatedFilledPercentage', v['lastData']['heatedFilledPercentage'], v['object'].getHeatedCoolantFilledPercentage())
          checkValue(v, 'REACTOR', 'waste', v['lastData']['waste'], v['object'].getWaste()['amount'])
          checkValue(v, 'REACTOR', 'wasteCap', v['lastData']['wasteCap'], v['object'].getWasteCapacity())
          checkValue(v, 'REACTOR', 'wasteNeeded', v['lastData']['wasteNeeded'], v['object'].getWasteNeeded())
          checkValue(v, 'REACTOR', 'wasteFilledPercentage', v['lastData']['wasteFilledPercentage'], v['object'].getWasteFilledPercentage())
          checkValue(v, 'REACTOR', 'burnRate', v['lastData']['burnRate'], v['object'].getBurnRate())
          checkValue(v, 'REACTOR', 'maxBurnRate', v['lastData']['maxBurnRate'], v['object'].getMaxBurnRate())
          checkValue(v, 'REACTOR', 'actualBurnRate', v['lastData']['actualBurnRate'], v['object'].getActualBurnRate())
          checkValue(v, 'REACTOR', 'damagePercentage', v['lastData']['damagePercentage'], v['object'].getDamagePercent())
          checkValue(v, 'REACTOR', 'heatingRate', v['lastData']['heatingRate'], v['object'].getHeatingRate())
          checkValue(v, 'REACTOR', 'environmentalLoss', v['lastData']['enviromentalLoss'], v['object'].getEnvironmentalLoss())
          checkValue(v, 'REACTOR', 'heatCapacity', v['lastData']['heatCapacity'], v['object'].getHeatCapacity())
          checkValue(v, 'REACTOR', 'fuelAssemblies', v['lastData']['fuelAssemblies'], v['object'].getFuelAssemblies())
          checkValue(v, 'REACTOR', 'fuelSurfaceArea', v['lastData']['fuelSurfaceArea'], v['object'].getFuelSurfaceArea())
          checkValue(v, 'REACTOR', 'boilEfficiency', v['lastData']['boilEfficiency'], v['object'].getBoilEfficiency())

          -- Status
          local machineStatus = false
          if v['lastData']['actualBurnRate'] ~= nil and v['lastData']['actualBurnRate'] > 0 then
            machineStatus = true
          end
          checkValue(v, 'REACTOR', 'status', v['lastData']['status'], machineStatus)
        end)

        if not status then
          print("Failed when fetching data: " .. err)
          reactor = {}
          isSetup = false
          break
        end
      end
    elseif #boilers > 0 then
      for k, v in pairs(boilers) do
        local status, err = pcall(function()
          checkValue(v, 'BOILER', 'water', v['lastData']['water'], v['object'].getWater()['amount'])
          checkValue(v, 'BOILER', 'waterCap', v['lastData']['waterCap'], v['object'].getWaterCapacity())
          checkValue(v, 'BOILER', 'waterFilledPercentage', v['lastData']['waterFilledPercentage'], v['object'].getWaterFilledPercentage())
          checkValue(v, 'BOILER', 'heatedCoolantName', v['lastData']['heatedCoolantName'], v['object'].getHeatedCoolant()['name'])
          checkValue(v, 'BOILER', 'heatedCoolantAmount', v['lastData']['heatedCoolantAmount'], v['object'].getHeatedCoolant()['amount'])
          checkValue(v, 'BOILER', 'heatedCoolantCap', v['lastData']['heatedCoolantCap'], v['object'].getHeatedCoolantCapacity())
          checkValue(v, 'BOILER', 'heatedCoolantNeeded', v['lastData']['heatedCoolantNeeded'], v['object'].getHeatedCoolantNeeded())
          checkValue(v, 'BOILER', 'heatedCoolantFilledPercentage', v['lastData']['heatedCoolantFilledPercentage'], v['object'].getHeatedCoolantFilledPercentage())
          checkValue(v, 'BOILER', 'steam', v['lastData']['steam'], v['object'].getSteam()['amount'])
          checkValue(v, 'BOILER', 'steamCap', v['lastData']['steamCap'], v['object'].getSteamCapacity())
          checkValue(v, 'BOILER', 'steamFilledPercentage', v['lastData']['steamFilledPercentage'], v['object'].getSteamFilledPercentage())
          checkValue(v, 'BOILER', 'cooledCoolantName', v['lastData']['cooledCoolantName'], v['object'].getCooledCoolant()['name'])
          checkValue(v, 'BOILER', 'cooledCoolantAmount', v['lastData']['cooledCoolantAmount'], v['object'].getCooledCoolant()['amount'])
          checkValue(v, 'BOILER', 'cooledCoolantCap', v['lastData']['cooledCoolantCap'], v['object'].getCooledCoolantCapacity())
          checkValue(v, 'BOILER', 'cooledCoolantNeeded', v['lastData']['cooledCoolantNeeded'], v['object'].getCooledCoolantNeeded())
          checkValue(v, 'BOILER', 'cooledCoolantFilledPercentage', v['lastData']['cooledCoolantFilledPercentage'], v['object'].getCooledCoolantFilledPercentage())
          checkValue(v, 'BOILER', 'environmentalLoss', v['lastData']['environmentalLoss'], v['object'].getEnvironmentalLoss())
          checkValue(v, 'BOILER', 'temperature', v['lastData']['temperature'], v['object'].getTemperature())
          checkValue(v, 'BOILER', 'lastBoilRate', v['lastData']['lastBoilRate'], v['object'].getBoilRate())
          checkValue(v, 'BOILER', 'maxBoilRate', v['lastData']['maxBoilRate'], v['object'].getMaxBoilRate())
          checkValue(v, 'BOILER', 'superheaters', v['lastData']['superheaters'], v['object'].getSuperheaters())
          checkValue(v, 'BOILER', 'boilCap', v['lastData']['boilCap'], v['object'].getBoilCapacity())

          -- Status
          local machineStatus = false
          if v['lastData']['productionRate'] ~= nil and v['lastData']['productionRate'] > 1 then
            machineStatus = true
          end
          checkValue(v, 'BOILER', 'status', v['lastData']['status'], machineStatus)
        end)

        if not status then
          print("Failed when fetching data: " .. err)
          boilers = {}
          isSetup = false
          break
        end
      end
    elseif #turbines > 0 then
      for k, v in pairs(turbines) do
        local status, err = pcall(function()
          checkValue(v, 'TURBINE', 'steam', v['lastData']['steam'], v['object'].getSteam()['amount'])
          checkValue(v, 'TURBINE', 'steamCap', v['lastData']['steamCap'], v['object'].getSteamCapacity())
          checkValue(v, 'TURBINE', 'steamNeeded', v['lastData']['steamNeeded'], v['object'].getSteamNeeded())
          checkValue(v, 'TURBINE', 'maxProduction', v['lastData']['maxProduction'], v['object'].getMaxProduction())
          checkValue(v, 'TURBINE', 'maxFlowRate', v['lastData']['maxFlowRate'], v['object'].getMaxFlowRate())
          checkValue(v, 'TURBINE', 'lastSteamInputRate', v['lastData']['lastSteamInputRate'], v['object'].getLastSteamInputRate())
          checkValue(v, 'TURBINE', 'steamFilledPercentage', v['lastData']['steamFilledPercentage'], v['object'].getSteamFilledPercentage())
          checkValue(v, 'TURBINE', 'dumpingMode', v['lastData']['dumpingMode'], v['object'].getDumpingMode())
          checkValue(v, 'TURBINE', 'productionRate', v['lastData']['productionRate'], v['object'].getProductionRate())
          checkValue(v, 'TURBINE', 'flowRate', v['lastData']['flowRate'], v['object'].getFlowRate())
          checkValue(v, 'TURBINE', 'maxWaterOutput', v['lastData']['maxWaterOutput'], v['object'].getMaxWaterOutput())
          checkValue(v, 'TURBINE', 'dispersers', v['lastData']['dispersers'], v['object'].getDispersers())
          checkValue(v, 'TURBINE', 'vents', v['lastData']['vents'], v['object'].getVents())
          checkValue(v, 'TURBINE', 'blades', v['lastData']['blades'], v['object'].getBlades())
          checkValue(v, 'TURBINE', 'coils', v['lastData']['coils'], v['object'].getCoils())
          checkValue(v, 'TURBINE', 'condensers', v['lastData']['condensers'], v['object'].getCondensers())

          -- Status
          local machineStatus = false
          if v['lastData']['productionRate'] ~= nil and v['lastData']['productionRate'] > 1 then
            machineStatus = true
          end
          checkValue(v, 'TURBINE', 'status', v['lastData']['status'], machineStatus)
        end)

        if not status then
          print("Failed when fetching data: " .. err)
          turbines = {}
          isSetup = false
          break
        end
      end
    elseif #induction > 0 then
      for k, v in pairs(induction) do
        local status, err = pcall(function()
          checkValue(v, 'INDUCTION', 'energy', v['lastData']['energy'], v['object'].getEnergy())
          checkValue(v, 'INDUCTION', 'energyCap', v['lastData']['energyCap'], v['object'].getMaxEnergy())
          checkValue(v, 'INDUCTION', 'energyNeeded', v['lastData']['energyNeeded'], v['object'].getEnergyNeeded())
          checkValue(v, 'INDUCTION', 'energyFilledPercentage', v['lastData']['energyFilledPercentage'], v['object'].getEnergyFilledPercentage())
          checkValue(v, 'INDUCTION', 'transferCap', v['lastData']['transferCap'], v['object'].getTransferCap())
          checkValue(v, 'INDUCTION', 'lastInput', v['lastData']['lastInput'], v['object'].getLastInput())
          checkValue(v, 'INDUCTION', 'lastOutput', v['lastData']['lastOutput'], v['object'].getLastOutput())
          checkValue(v, 'INDUCTION', 'cells', v['lastData']['cells'], v['object'].getInstalledCells())
          checkValue(v, 'INDUCTION', 'providers', v['lastData']['providers'], v['object'].getInstalledProviders())
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
end

-- Listen for messages coming in over the modem channel
local function listenForMessage()
  while true do
    local event, side, channel, replyChannel, message, distance = os.pullEvent("modem_message")

    -- Try and unserialize if it's a JSON
    local status, err = pcall(function()
      message = textutils.unserializeJSON(message)
    end)

    if channel == modemChannel then
      if message['TYPE'] == 'SCRAM' then
        local status, err = pcall(function()
          reactor[1]['object'].scram()
        end)
      elseif message['TYPE'] == 'BURNRATE' then
        local status, err = pcall(function()
          reactor[1]['object'].setBurnRate(message['DATA'])
        end)
      elseif message['TYPE'] == 'RAD' then
        for _, reactorV in pairs(reactor) do
          for key, data in pairs(reactorV['lastData']) do
            local status, err = pcall(function()
              wirelessModems[1].transmit(modemChannel, modemChannel, {
                ['TYPE'] = 'DATA',
                ['TAG'] = 'REACTOR',
                ['DATA'] = {[key] = data}
              })
            end)
          end
        end

        for _, boiler in pairs(boilers) do
          for key, data in pairs(boiler['lastData']) do
            local status, err = pcall(function()
              wirelessModems[1].transmit(modemChannel, modemChannel, {
                ['TYPE'] = 'DATA',
                ['TAG'] = 'BOILER',
                ['DATA'] = {[key] = data}
              })
            end)
          end
        end

        for _, turbine in pairs(turbines) do
          for key, data in pairs(turbine['lastData']) do
            local status, err = pcall(function()
              wirelessModems[1].transmit(modemChannel, modemChannel, {
                ['TYPE'] = 'DATA',
                ['TAG'] = 'TURBINE',
                ['DATA'] = {[key] = data}
              })
            end)
          end
        end

        for _, inductionV in pairs(induction) do
          for key, data in pairs(inductionV['lastData']) do
            local status, err = pcall(function()
              wirelessModems[1].transmit(modemChannel, modemChannel, {
                ['TYPE'] = 'DATA',
                ['TAG'] = 'INDUCTION',
                ['DATA'] = {[key] = data}
              })
            end)
          end
        end
      end
    end
  end
end

local function tick()
  while true do
    getListenerValues()

    print(os.time())
    sleep(transmitInterval)
  end
end



function main()
  wirelessModems[1].open(modemChannel)

  parallel.waitForAny(tick, listenForMessage)
end

main()
