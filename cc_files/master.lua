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
    if channel == modemChannel and message then
      local listenerType = message["TAG"]

      --Convert Data into JSON format
      local messageJson = textutils.serialiseJSON(message)

      local status, err = pcall(function()
        ws.send(messageJson)
        print("Sending Data From: " .. listenerType)
      end)
      if not status then
        print(err)
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
