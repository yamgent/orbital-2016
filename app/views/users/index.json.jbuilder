json.array!(@edit_all_users) do |user|
  json.extract! user, :id, :matricNo
  json.url user_url(user, format: :json)
end
