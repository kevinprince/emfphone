class Subscriber
  include DataMapper::Resource

  property :id, Serial
  property :username, String
  property :location, String
  property :updated_at, DateTime
  property :created_at, DateTime

end
