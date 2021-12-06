--[[
  THIS CODE IS DEVELOPED AND MAINTAINED BY TheDwarfer

  Have fun, try not to blow it up. -TheDwarfer
]]

local modemChannel = 1
local expectedTime = 1

-- Connect to the server to send/receive data
local adress = "ws://localhost:4000"
local ws, err = http.websocket(adress)

-- Find the wireless modems
local wirelessModems = table.pack(peripheral.find("modem", function(_, modem)
  return modem.isWireless()
end))

local function listenForMessage()
  while true do
    local event, side, channel, replyChannel, message, distance = os.pullEvent("modem_message")
    if channel == modemChannel and not monitorNameMode and message then
      local listenerType = message["type"]

      -- Call the methods of each jef module (only 1 reactor so message is sent directly)
      if listenerType == "reactor" then
        local status, err = pcall(function()
          ws.send(message)
          print("Got Data From Reactor!")
        end)
        if not status then
          print(err)
        end
      end

      if listenerType == "boiler"then
        local status, err = pcall(function()
          ws.send(message)
          print("Got Data From Boiler!")
        end)
        if not status then
          print(err)
        end
      end

      if listenerType == "turbine" then
        local status, err = pcall(function()
          ws.send(message)
          print("Got Data From Turbine!")
        end)
        if not status then
          print(err)
        end
      end

      if listenerType == "induction" then
        local status, err = pcall(function()
          ws.send(message)
          print("Got Data From Induction Matrix!")
        end)
        if not status then
          print(err)
        end
      end
    end
  end
end

local function main()
  wirelessModems[1].open(modemChannel)

  if ws then
    -- Request an ID from the server
    print("Requesting UUID...")
    ws.send("RID")

    -- Wait for response
    local timeout = 10  -- Seconds
    local response = ws.receive(timeout)
    print("Got UUID: " .. response)
  else
    print(err)
  end

  while true do
    parallel.waitForAny(listenForMessage)
    sleep(0.1)
  end
end

main()
