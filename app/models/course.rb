class Course < ActiveRecord::Base
  has_many :lectures
  has_many :tutorials
end
