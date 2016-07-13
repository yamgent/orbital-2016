class AddOddEvenToTutorial < ActiveRecord::Migration
  def change
    add_column :tutorials, :odd_even, :integer, default: 0
  end
end
