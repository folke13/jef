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

local function listenForPuppetMessage()
  while true do
    local event, side, channel, replyChannel, message, distance = os.pullEvent("modem_message")
    if channel == modemChannel and message then
      --Convert Data into JSON format
      local messageJson = textutils.serialiseJSON(message)

      local status, err = pcall(function()
        ws.send(messageJson)
      end)
      if not status then
        print(err)
      end
    end
  end
end

local function listenForServerMessage()
  while true do
    local status, err = pcall(function()
      local data = ws.receive(10)

      if data == 'SCRAM' then
        --Got a SCRAM message, quickly send it to the puppet for reactor shutdown
        print("SCRAM instruction Received!")
      elseif data == 'RAD' then
        -- Requesting All Data
        print("RAD instruction Received!")
      end

      wirelessModems[1].transmit(modemChannel, modemChannel, data)
    end)
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
    parallel.waitForAny(listenForPuppetMessage, listenForServerMessage)
    sleep(0.1)
  end
end

main()
