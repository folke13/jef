-- Create a websocket to the server
local adress = "ws://localhost:4000"
local ws, err = http.websocket(adress)

if ws do
  -- Request an ID from the server
  print("Requesting UUID...")
  ws.send("RID")

 while ws then
    -- Wait for response
    local timeout = 10  -- Seconds
    local response = ws.receive(timeout)
    print("Got UUID: " + response)
  end
else
  print(err)
end

print("Exiting Program...")
